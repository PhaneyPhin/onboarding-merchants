import { Body, Controller, Get, Headers, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { RejectDto } from './dto/reject.dto';
import { MerchantListQuery } from './interface/MerchantListQuery';
import { UserService } from './user.service';

@Controller('onboard-request')
export class ReviewingController {
  constructor(
    private readonly onboardingMerchantService: OnboardingMerchantService,
    private readonly userService: UserService
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
}
