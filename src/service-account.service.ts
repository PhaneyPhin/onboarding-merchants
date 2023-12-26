import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { Axios } from "axios";
import { OnboardingMerchant } from "./entities/onboarding-merchant.entity";

interface BankInfo {
    bakongId: string;
    bankName: string;
    description: string;
}


@Injectable()
export class ServiceAccountService
{
    private http: Axios;

    constructor(
        private configService: ConfigService
    ) {
        this.http = axios.create({
            baseURL: this.configService.get('serviceAccountBaseUrl')
        })
    }

    public createMerchant = async (merchant: OnboardingMerchant) => {
        try {
            const result = await this.http.post('merchant', {
                name: merchant.merchant_name,
                address: {
                  city_name: merchant.company_name,
                  country_code: "KH"
                },
                party_tax_scheme: {
                  company_id: merchant.tin,
                  tax_scheme: "VAT"
                },
                party_legal_entity: {
                  registration_name: merchant.company_name,
                  company_id: merchant.moc_id
                },
                contact: {
                  name: merchant.merchant_name,
                  phone: merchant.phone_number,
                  email: merchant.email
                },
                business_type: merchant.business_type,
                date_of_incorporation: merchant.date_of_incorporation,
                bank_account_number: merchant.bank_account_number,
                currency: "USD",
                bank_name: merchant.bank_name,
                description: "",
                national_id_number: merchant.national_id
              })
            
            return result.data.data
          } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    public async getServiceAccountByMocId(mocID: string) {
      try {
        const result = await this.http.get('merchant/moc/' + mocID)
        return result.data?.data
      } catch (e) {
        console.log(e)
        return null;
      }
    }
}