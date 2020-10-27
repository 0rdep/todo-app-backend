import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum TodoTypeEnum {
  personal,
  work,
  home,
}

export default class UpdateTodoDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsDateString()
  date: Date;

  @ApiProperty({ required: true, enum: TodoTypeEnum })
  @IsEnum(TodoTypeEnum)
  category: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  done: boolean;
}
