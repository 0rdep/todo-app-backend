import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import {
  MongoGridFS,
  IGridFSWriteOption,
} from 'mongo-gridfs/dist/mongo-gridfs.class';
import { Connection } from 'mongoose';

@Injectable()
export class ImagesService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.fileModel = new MongoGridFS(this.connection.db, 'images');
  }

  async readStream(id: string) {
    return this.fileModel.readFileStream(id);
  }

  async writeStream(stream, options?: IGridFSWriteOption) {
    return await this.fileModel.writeFileStream(stream, options);
  }

  public async writeFile(file: any, metadata?: any) {
    return await this.fileModel.uploadFile(
      file.path,
      {
        filename: file.originalname,
        contentType: file.mimetype,
        metadata,
      },
      true,
    );
  }
}
