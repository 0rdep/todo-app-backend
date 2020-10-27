import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import RegisterRequestDTO from 'src/dto/auth/register-request.dto';
import User from '../models/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(registerDto: RegisterRequestDTO) {
    const createUser = new this.userModel(registerDto);
    return createUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
