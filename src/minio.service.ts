import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio'

@Injectable()
export class MinioService {
   private minIOClient: Minio.Client;

  constructor(
    private configService: ConfigService
  ) {
    console.log(this.configService.get('minio'))
    this.minIOClient = new Minio.Client(this.configService.get('minio'));
  }

  async upload(fileName: string, file: Express.Multer.File) {
    const result = await this.minIOClient.putObject(this.configService.get('documentBucket'), fileName, file.buffer)

    return fileName
  }

  async getTempUrl(path: string) {
    try {
      return await this.minIOClient.presignedGetObject(this.configService.get('documentBucket'), path, 15 * 60)
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  async getFileSize(path) {
    try {
      const state = await this.minIOClient.statObject(this.configService.get('documentBucket'), path);
      return state.size
    } catch (e) {
      return null
    }
  }

  async getFile(path: string) {
    return new Promise((resolve, reject) => {
      let data: any = null;

      this.minIOClient.getObject(this.configService.get('documentBucket'), path, function (err, objStream) {
        if (err) {
          reject(err)
        }

        objStream.on('data', function (chunk) {
          data = !data ? Buffer.from(chunk) : Buffer.concat([data, chunk]);
        })
        objStream.on('end', function () {
          resolve(data)
        })

        objStream.on('error', function (err) {
          reject(err)
        })
      });
    })
  }

  async remove(path)
  {
    try {
      await this.minIOClient.removeObject(this.configService.get('documentBucket'), path)
    } catch (e) {
      
    }
  }
}
