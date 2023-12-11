import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class Step2Dto {
    @ApiProperty()
    @IsString()
    merchant_name?: string;
  
    @ApiProperty()
    @IsString()
    merchant_id?: string;
  
    @ApiProperty()
    @IsString()
    bank_name?: string;
  
    @ApiProperty()
    @IsString()
    bank_account_number?: string;
  
    @ApiProperty()
    @IsString()
    certificate_of_incorporation?: string;
  
    @ApiProperty()
    @IsString()
    certificate_of_tax_registration?: string;
  
    @ApiProperty()
    @IsString()
    bank_acc_ownership_doc?: string;
  
    @ApiProperty()
    @IsString()
    @ApiProperty()
    @IsOptional()
    supporting_doc?: string;
}