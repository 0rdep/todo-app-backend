import { ApiProperty } from '@nestjs/swagger';

export class TodoDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  category: string;

  @ApiProperty()
  done: boolean;
}
