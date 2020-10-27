import { ApiProperty } from '@nestjs/swagger';

export default class LoginResponseDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: number;

  constructor(username: string, accessToken: string, expiresIn: number) {
    this.username = username;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}
