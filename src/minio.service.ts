import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio'

@Injectable()
export class MinioService {
   private minIOClient: Minio.Client;

  constructor(
    private configService: ConfigService
  ) {
    this.minIOClient = new Minio.Client(this.configService.get('minio'));
  }

  async upload(fileName: string, file: Express.Multer.File) {
    const result = await this.minIOClient.putObject(this.configService.get('documentBucket'), fileName, file.buffer)

    return fileName
  }

  async getTempUrl(path: string) {
    try {
      return await this.minIOClient.presignedGetObject(this.configService.get('documentBucket'), path, 60)
    } catch (e) {
      return null;
    }
  }

  async remove(path)
  {
    try {
      await this.minIOClient.removeObject(this.configService.get('documentBucket'), path)
    } catch (e) {
      
    }
  }
}
