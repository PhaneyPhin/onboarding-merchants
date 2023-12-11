import { Body, Controller, Get, Headers, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { Step1Dto } from './dto/step1.dto';
import { Step2Dto } from './dto/step2.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

@Controller()
export class RegistrationController {
  constructor(
    private readonly onboardingMerchantService: OnboardingMerchantService,
    private readonly minioService: MinioService,
    ) {
    }

  @Post('/step-1')
  async saveStep1(@Headers() headers, @Body() data: Step1Dto) {
    return await this.onboardingMerchantService.save(headers['national_id'] as string, { ...data, step: 2 })
  }

  @Post('/step-2')
  async saveStep2(@Headers() headers, @Body() data: Step2Dto) {
    return await this.onboardingMerchantService.save(headers['national_id'] as string, { ...data, step: 3})
  }

  @Post('/register')
  async register(@Headers() headers) {
    return await this.onboardingMerchantService.register(headers['national_id'] as string)
  }

  @Get('/')
  async getDetail(@Headers() headers)
  {
    return await this.onboardingMerchantService.getDetail(headers['national_id'] as string)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Headers() headers) {
      const fileName = (headers['national_id'] as string) + '/' + file.originalname
      return await this.minioService.upload(fileName, file);
  }
}
