import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { RejectDto } from './dto/reject.dto';
import { MerchantListQuery } from './interface/MerchantListQuery';
import { UserService } from './user.service';
import { OnboardingMerchant } from './entities/onboarding-merchant.entity';
import { MinioService } from './minio.service';
import { Response } from 'express';

@Controller('onboard-request')
export class ReviewingController {
  constructor(
    private readonly onboardingMerchantService: OnboardingMerchantService,
    private readonly userService: UserService,
    private readonly minioService: MinioService
    ) {
    }

  @Post('/reject/:nationalId')
  async reject(@Param('nationalId') nationalId: string, @Body() data: RejectDto) {
    return await this.onboardingMerchantService.reject(nationalId, data)
  }

  @Get('/')
  async GetRequestOnboardList(@Query() paginationQuery: MerchantListQuery) {
    return await this.onboardingMerchantService.get(paginationQuery)
  }

  @Get('/:nationalId')
  async getByNationalId(@Param('nationalId') nationalId: string) {
    return {
      user: await this.userService.find(nationalId),
      merchantData: await this.onboardingMerchantService.getDetail(nationalId)
    }
  }

  @Post('/approve/:nationalId')
  async approveMerchant(@Param('nationalId') nationalId: string)
  {
     const merchant = await this.onboardingMerchantService.find(nationalId)
     await this.onboardingMerchantService.approve(merchant)

     return { message: 'merchant was approved'}
  }

  @Get('doc/:nationalId/:fieldName')
  async downloadFile(@Param('nationalId') nationalId: string, @Param('fieldName') fieldName: keyof OnboardingMerchant, @Res() res: Response) {
    const merchant = await this.onboardingMerchantService.find(nationalId)

    if (merchant[fieldName]) {
      const data = await this.minioService.getFile(merchant.national_id + '/' + merchant[fieldName])
      res.attachment(merchant[fieldName] as string)
      res.writeHead(200, { 'Content-Type': 'application/pdf' })
      res.end(data)
    }
    
    throw new NotFoundException()
  }
}
