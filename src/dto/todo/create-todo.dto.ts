import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum TodoTypeEnum {
  personal,
  work,
  home,
}

export default class CreateTodoDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsDateString()
  date: string;

  @ApiProperty({ required: true, enum: TodoTypeEnum })
  @IsEnum(TodoTypeEnum)
  category: string;
}
