import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Todo extends Document {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop({ default: new Date() })
  date: Date;

  @Prop()
  category: string;

  @Prop({ default: false })
  done: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export default Todo;
