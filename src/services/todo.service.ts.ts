import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateTodoDTO from 'src/dto/todo/create-todo.dto';
import UpdateTodoDTO from 'src/dto/todo/update-todo.dto';
import Todo from 'src/models/todo';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async findAll(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.todoModel
      .aggregate([
        { $match: { userId, date: { $gte: today, $lt: tomorrow } } },
        {
          $group: {
            _id: '$date',
          },
        },
      ])
      .sort({ date: 'asc' })
      .exec();
  }

  async getTodayTasksByCategory(userId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return this.todoModel
      .aggregate([
        { $match: { userId, date: { $gte: today } } },
        {
          $group: {
            _id: '$category',
            total: { $sum: 1 },
            done: { $sum: { $cond: ['$done', 1, 0] } },
          },
        },
      ])
      .then(ret => {
        return ret.map(r => ({
          category: r._id,
          total: r.total,
          done: r.done,
        }));
      });
  }

  async findById(userId: string, todoId: string) {
    return this.todoModel.findOne({ userId, _id: todoId }).exec();
  }

  async findByCategory(userId: string, category: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return this.todoModel
      .find({ userId, category, date: { $gte: today } })
      .sort({ date: 'asc' })
      .exec();
  }

  async getCountByCategory(userId: string) {
    return this.todoModel
      .aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', number: { $sum: 1 } } },
      ])
      .exec();
  }

  async create(userId: string, createTodo: CreateTodoDTO) {
    const todo = new this.todoModel({ ...createTodo, userId });
    return todo.save();
  }

  async update(userId: string, todoId: string, todo: UpdateTodoDTO) {
    return this.todoModel.update({ _id: todoId, userId }, todo).exec();
  }

  async delete(userId: string, todoId: string) {
    return this.todoModel.findByIdAndDelete({ _id: todoId, userId }).exec();
  }

  async markDone(userId: string, todoId: string) {
    return this.todoModel
      .update({ _id: todoId, userId }, { done: true })
      .exec();
  }
}
