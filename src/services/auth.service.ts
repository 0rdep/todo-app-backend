import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import User from 'src/models/user';
import { UsersService } from 'src/services/users.service';
import * as bcrypt from 'bcrypt';
import LoginResponseDTO from 'src/dto/auth/login-response.dto';
import RegisterRequestDTO from 'src/dto/auth/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user?.password);
    if (!passwordsMatch) {
      return null;
    }

    return user;
  }

  async login(username: string) {
    const user = await this.usersService.findOne(username);
    const payload = { username: user.username, sub: user.id };
    return new LoginResponseDTO(username, this.jwtService.sign(payload), 3600);
  }

  async register(dto: RegisterRequestDTO) {
    const user = await this.usersService.findOne(dto.username);
    if (!!user) {
      throw new BadRequestException('Username already exists');
    }

    dto.password = await bcrypt.hash(dto.password, 10);
    await this.usersService.create(dto);
  }
}
