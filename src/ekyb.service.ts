import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { Axios } from "axios";
import { OnboardingMerchant } from "./entities/onboarding-merchant.entity";

export interface EkybParm {
    single_id: string,
    company_name_en: string
}

@Injectable()
export class EkybService
{
    private http: Axios;

    constructor(
        private configService: ConfigService
    ) {
        console.log(this.configService.get('ekybUrl'), this.configService.get('ekybRoadClient'))
        this.http = axios.create({
            baseURL: this.configService.get('ekybUrl'),
            headers: {
                'x-road-client': this.configService.get('ekybRoadClient'),
                'Content-Type': 'application/json'
            }
        })
    }

    public validate = async (data: EkybParm) => {
        console.log(data)
        try {
            const result = await this.http.post('/api/2.0/kyb/company/info', data)
            console.log(result)
            if (result?.data?.data?.incorrect_fields?.length === 0) {
                return true;
            }
        } catch (e) {
           // invalid EKYB
        }

        return false
    }
}