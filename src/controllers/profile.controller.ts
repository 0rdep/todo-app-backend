import {
  Controller,
    Delete,
  Get,
  Header,
  HttpCode,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import User from 'src/models/user';
import { ImagesService } from 'src/services/images.service';
import { UsersService } from 'src/services/users.service';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(
    private filesService: ImagesService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async uploadAvatar(@UploadedFile() avatarImage, @Req() request: Request) {
    const user = request.user as User;
    const uploadedAvatar = await this.filesService.writeFile(avatarImage, {
      filename: user.username + '.png',
    });
    const dbUser = await this.userService.findOne(user.username);
    dbUser.avatar = uploadedAvatar._id.toHexString();
    await dbUser.save();
  }

  @UseGuards(JwtAuthGuard)
  @Get('avatar')
  @Header('Content-Type', 'image/png')
  async getAvatar(@Req() request: Request, @Res() response: Response) {
    const user = request.user as User;
    const { avatar } = await this.userService.findOne(user.username);
    if (!!avatar) {
      const fileStream = await this.filesService.readStream(avatar);
      return fileStream.pipe(response);
    }
    return fs.createReadStream('./src/assets/default-avatar.png').pipe(response);
  }
}
