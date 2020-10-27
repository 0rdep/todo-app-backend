import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import User, { UserSchema } from './models/user';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './services/users.service';
import { ImagesService } from './services/images.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { ProfileController } from './controllers/profile.controller';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service.ts';
import Todo, { TodoSchema } from './models/todo';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MulterModule.register({
      dest: '/upload',
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Todo.name, schema: TodoSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController, ProfileController, TodoController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    ImagesService,
    TodoService,
  ],
})
export class AppModule {}
