import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnboardingMerchant } from './entities/onboarding-merchant.entity';
import { Repository } from 'typeorm';
import { MerchantStatus } from './enums/MerchantStatus';
import { RejectDto } from './dto/reject.dto';
import { MerchantListQuery } from './interface/MerchantListQuery';
import { MinioService } from './minio.service';
import { ServiceAccountService } from './service-account.service';

@Injectable()
export class OnboardingMerchantService {
  constructor(
    @InjectRepository(OnboardingMerchant)
    private onboardingMerchantRepository : Repository<OnboardingMerchant>,
    private readonly minioService: MinioService,
    private readonly serviceAccountService: ServiceAccountService,
  ) {

  }

  async save(nationalID: string, merchantData: Partial<OnboardingMerchant>) {
    const merchant = await this.onboardingMerchantRepository.findOneBy({
      national_id: nationalID
    })

    return await this.onboardingMerchantRepository.save({
      ...merchant,
      national_id: nationalID,
      ...merchantData
    });
  }

  async register(nationalID: string)
  {
    const merchant = await this.find(nationalID)

    merchant.status = MerchantStatus.READY_FOR_REVIEW;
    return await this.onboardingMerchantRepository.save(merchant)
  }

  async find(nationalID: string) {
    return await this.onboardingMerchantRepository.findOneBy({
      national_id: nationalID
    })
  }

  async reject(nationalID: string, rejectionData: RejectDto)
  {
    const merchant = await this.find(nationalID)
    merchant.rejected_at = new Date()
    merchant.rejection_type = rejectionData.type
    merchant.rejection_message = rejectionData.message

    return await this.onboardingMerchantRepository.save(merchant)
  }

  async get(paginationQuery: MerchantListQuery)
  {
      const query = this.onboardingMerchantRepository.createQueryBuilder('merchant');
      const page = paginationQuery.page || 1
      const pageSize = paginationQuery.size || 20

      if (paginationQuery.status) {
        query.where('status = :status', { status: paginationQuery.status })
      }

      if (paginationQuery.keyword) {
        query.where('(merchant.company_name LIKE :keyword OR merchant.tin LIKE :keyword OR merchant.moc_id LIKE :keyword OR merchant.phone_number LIKE :keyword OR merchant.email LIKE :keyword OR merchant.merchant_name LIKE :keyword)', { keyword: `%${paginationQuery.keyword}%` })
      }
      const [data, total] = await query
        .skip((page - 1)* pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        pagination: {
          page: page,
          size: pageSize,
          total_counts: total,
          total_pages: totalPages
        }
      }
  }

  async getDetail(nationId: string) {
    const merchant = await this.find(nationId)
    merchant.certificate_of_incorporation = await this.minioService.getTempUrl(merchant.certificate_of_incorporation)
    merchant.certificate_of_tax_registration = await this.minioService.getTempUrl(merchant.certificate_of_incorporation)
    merchant.supporting_doc = await this.minioService.getTempUrl(merchant.supporting_doc)
    merchant.bank_acc_ownership_doc = await this.minioService.getTempUrl(merchant.bank_acc_ownership_doc)
    return merchant
  }

  async approve(merchant: OnboardingMerchant)
  {
     await this.serviceAccountService.createMerchant(merchant)
     await this.minioService.remove(merchant.certificate_of_incorporation)
     await this.minioService.remove(merchant.certificate_of_tax_registration)
     await this.minioService.remove(merchant.bank_acc_ownership_doc)
     await this. minioService.remove(merchant.supporting_doc)
     await this.onboardingMerchantRepository.delete({ id: merchant.id })
  }
}
