import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDateString } from 'class-validator';

export class Step1Dto {
  @ApiProperty()
  @IsString()
  company_name: string;

  @ApiProperty()
  @IsString()
  tin: string;

  @ApiProperty()
  @IsString()
  moc_id: string;

  @ApiProperty()
  @IsDateString()
  date_of_incorporation: Date;

  @ApiProperty()
  @IsString()
  business_type: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
