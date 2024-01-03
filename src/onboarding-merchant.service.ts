import { Injectable, NotFoundException } from '@nestjs/common';
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

    await this.onboardingMerchantRepository.save({
      ...merchant,
      national_id: nationalID,
      status: MerchantStatus.DRAFT,
      ...merchantData
    });

    return await this.getDetail(nationalID)
  }

  async register(nationalID: string)
  {
    const merchant = await this.find(nationalID)

    merchant.status = MerchantStatus.READY_FOR_REVIEW;
    return await this.onboardingMerchantRepository.save(merchant)
  }

  async find(nationalID: string) {
    let onboardingMerchant = await this.onboardingMerchantRepository.findOneBy({
      national_id: nationalID
    })

    if (onboardingMerchant && onboardingMerchant.status === MerchantStatus.APPROVED) {
      throw new NotFoundException()
    }
    
    return onboardingMerchant;
  }

  async reject(nationalID: string, rejectionData: RejectDto)
  {
    const merchant = await this.find(nationalID)
    merchant.rejected_at = new Date()
    merchant.rejection_type = rejectionData.type
    merchant.rejection_message = rejectionData.message
    merchant.status = MerchantStatus.REJECTED

    return await this.onboardingMerchantRepository.save(merchant)
  }

  async get(paginationQuery: MerchantListQuery)
  {
      const query = this.onboardingMerchantRepository.createQueryBuilder('merchant');
      const page = paginationQuery.page || 1
      const pageSize = paginationQuery.size || 20

      if (paginationQuery.status) {
        query.andWhere('status = :status', { status: paginationQuery.status })
      }

      if (paginationQuery.keyword) {
        query.andWhere(`(lower(merchant.national_id) like lower(:keyword)
          OR lower(merchant.company_name) LIKE lower(:keyword)
          OR lower(merchant.tin) LIKE lower(:keyword)
          OR lower(merchant.moc_id) LIKE lower(:keyword)
          OR lower(merchant.phone_number) LIKE lower(:keyword)
          OR lower(merchant.email) LIKE lower(:keyword)
          OR lower(merchant.merchant_name) LIKE lower(:keyword)
        )`, { keyword: `%${paginationQuery.keyword}%` })
      }

      const [data, total] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data,
        pagination: {
          page: Number(page),
          size: Number(pageSize),
          total_counts: total,
          total_pages: totalPages
        }
      }
  }

  async getDetail(nationId: string) {
    const merchant = await this.find(nationId)
    if (! merchant) {
      return null
    }

    const filesToProcess = [
      { prop: 'certificate_of_incorporation' },
      { prop: 'certificate_of_tax_registration' },
      { prop: 'supporting_doc' },
      { prop: 'bank_acc_ownership_doc' },
    ];
    
    const promises = filesToProcess.map(async (fileInfo) => {
      const prop = fileInfo.prop;
      merchant[prop + '_size'] = await this.minioService.getFileSize(merchant.national_id + '/' + merchant[prop]);
    });
    
    await Promise.all(promises);
    return merchant
  }

  async approve(merchant: OnboardingMerchant)
  {
     await this.serviceAccountService.createMerchant(merchant)
     await this.onboardingMerchantRepository.update({ id: merchant.id }, { status: MerchantStatus.APPROVED })
  }
}
