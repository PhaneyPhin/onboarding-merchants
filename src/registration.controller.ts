import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { Step1Dto } from './dto/step1.dto';
import { Step2Dto } from './dto/step2.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { AuthRequest } from './interface/AuthRequest';
import { EkybService } from './ekyb.service';
import { ServiceAccountService } from './service-account.service';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly onboardingMerchantService: OnboardingMerchantService,
    private readonly serviceAccountService: ServiceAccountService,
    private readonly minioService: MinioService,
    private readonly ekybService: EkybService
    ) {
    }

  @Post('/step-1')
  async saveStep1(@Req() authRequest: AuthRequest, @Body() data: Step1Dto) {
    const isValid = await this.ekybService.validate({
      single_id: data.moc_id,
      company_name_en: data.company_name
    })
        
    if (! isValid) {
      throw new BadRequestException([
        {
          path: 'moc_id',
          message: 'Moc ID is invalid'
        },
        {
          path: 'company_name',
          message: 'Company name is invalid'
        }
      ])
    }

    const serviceAccount = await this.serviceAccountService.getServiceAccountByMocId(data.moc_id);
    
    if (serviceAccount) {
      throw new BadRequestException([
        {
          path: 'moc_id',
          message: 'Moc ID already been registered'
        }
      ])
    }
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
    const data = await this.onboardingMerchantService.getDetail(authRequest.user.personalCode)
    return {
      user: authRequest.user,
      merchantData: data || {
        step: 1
      }
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fieldSize: 10 * 1024 * 1024 }}))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() authRequest: AuthRequest) {
      const fileName = (authRequest.user.personalCode) + '/' + file.originalname
      await this.minioService.upload(fileName, file);

      return { fileName: file.originalname }
  }
}
