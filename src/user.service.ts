import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { Axios } from "axios";

@Injectable()
export class UserService
{
    private http: Axios;

    constructor(
        private configService: ConfigService
    ) {
        this.http = axios.create({
            baseURL: this.configService.get('userAPIUrl')
        })
    }

    public find = async (nationId: string) => {
        try {
            const result = await this.http.get('user/id/' + nationId)
            
            return result.data.data
          } catch (e) {
            console.log(e)
            return null
        }
    }
}