import { MerchantStatus } from 'src/enums/MerchantStatus';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class OnboardingMerchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_name: string;

  @Column()
  tin: string;

  @Column()
  moc_id: string;

  @Column()
  date_of_incorporation: Date;

  @Column()
  business_type: string

  @Column()
  city: string

  @Column()
  country: string;

  @Column()
  phone_number: string;

  @Column()
  email: string;

  @Column({ default: 1 })
  step: number;

  @Column({ nullable: true})
  merchant_name: string;

  @Column({ nullable: true })
  merchant_id: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  bank_account_number: string;

  @Column({ nullable: true })
  certificate_of_incorporation: string;

  @Column({ nullable: true })
  certificate_of_tax_registration: string;

  @Column({ nullable: true })
  bank_acc_ownership_doc: string;

  @Column({ nullable: true })
  supporting_doc: string;

  @Column({ nullable: true })
  rejected_at: Date;

  @Column()
  national_id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: MerchantStatus.DRAFT })
  status: MerchantStatus;

  @Column({ nullable: true })
  rejection_type: string;

  @Column({ nullable: true })
  rejection_message: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}