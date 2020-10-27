import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import LoginRequestDTO from 'src/dto/auth/login-request.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import User from 'src/models/user';
import { AuthService } from 'src/services/auth.service';
import LoginResponseDTO from '../dto/auth/login-response.dto';
import RegisterRequestDTO from '../dto/auth/register-request.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDTO })
  async login(@Req() request: Request, @Body() body: LoginRequestDTO) {
    const user = request.user as User;
    return this.authService.login(user.username);
  }

  @Post('register')
  @HttpCode(200)
  async register(@Body() body: RegisterRequestDTO) {
    return this.authService.register(body);
  }
}
