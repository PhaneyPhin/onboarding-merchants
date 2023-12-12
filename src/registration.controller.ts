import { Body, Controller, Get, Headers, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { Step1Dto } from './dto/step1.dto';
import { Step2Dto } from './dto/step2.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { AuthRequest } from './interface/AuthRequest';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly onboardingMerchantService: OnboardingMerchantService,
    private readonly minioService: MinioService,
    ) {
    }

  @Post('/step-1')
  async saveStep1(@Req() authRequest: AuthRequest, @Body() data: Step1Dto) {
    return await this.onboardingMerchantService.save(authRequest.user.personalCode, { ...data, step: 2 })
  }

  @Post('/step-2')
  async saveStep2(@Req() authRequest: AuthRequest, @Body() data: Step2Dto) {
    return await this.onboardingMerchantService.save(authRequest.user.personalCode, { ...data, step: 3})
  }

  @Post('/register')
  async register(@Req() authRequest: AuthRequest) {
    return await this.onboardingMerchantService.register(authRequest.user.personalCode)
  }

  @Get('/')
  async getDetail(@Req() authRequest: AuthRequest)
  {
    return await this.onboardingMerchantService.getDetail(authRequest.user.personalCode)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() authRequest: AuthRequest) {
      const fileName = (authRequest.user.personalCode) + '/' + file.originalname
      await this.minioService.upload(fileName, file);

      return { fileName: fileName }
  }
}
