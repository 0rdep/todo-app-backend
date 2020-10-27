import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import CreateTodoDTO from 'src/dto/todo/create-todo.dto';
import UpdateTodoDTO from 'src/dto/todo/update-todo.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import User from 'src/models/user';
import { TodoService } from 'src/services/todo.service.ts';

@Controller('todo')
@ApiTags('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @HttpCode(200)
  async getAll(@Req() request: Request, @Query('category') category: string) {
    const user = request.user as User;
    if (!!category) {
      return await this.todoService.findByCategory(user.id, category);
    }
    return await this.todoService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/summary')
  @HttpCode(200)
  async getSumarry(@Req() request: Request, @Query('category') category: string) {
    const user = request.user as User;
    return await this.todoService.getTodayTasksByCategory(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':todoId')
  @HttpCode(200)
  async getById(@Req() request: Request, @Param('todoId') todoId: string) {
    const user = request.user as User;
    return await this.todoService.findById(user.id, todoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  @HttpCode(200)
  async summary(@Req() request: Request) {
    const user = request.user as User;
    return await this.todoService.getCountByCategory(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @HttpCode(200)
  async create(@Req() request: Request, @Body() body: CreateTodoDTO) {
    const user = request.user as User;
    await this.todoService.create(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':todoId')
  @HttpCode(200)
  async update(
    @Req() request: Request,
    @Param('todoId') todoId: string,
    @Body() body: UpdateTodoDTO,
  ) {
    const user = request.user as User;
    await this.todoService.update(user.id, todoId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':todoId/done')
  @HttpCode(200)
  async markDone(@Req() request: Request, @Param('todoId') todoId: string) {
    const user = request.user as User;
    await this.todoService.markDone(user.id, todoId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put(':todoId/undone')
  @HttpCode(200)
  async markUndone(@Req() request: Request, @Param('todoId') todoId: string) {
    const user = request.user as User;
    await this.todoService.markUndone(user.id, todoId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':todoId')
  @HttpCode(200)
  async delete(@Req() request: Request, @Param('todoId') todoId: string) {
    const user = request.user as User;
    await this.todoService.delete(user.id, todoId);
  }
}
