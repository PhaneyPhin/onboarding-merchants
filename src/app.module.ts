import dotenv from 'dotenv'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { OnboardingMerchantService } from './onboarding-merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingMerchant } from './entities/onboarding-merchant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { MinioService } from './minio.service';
import { ReviewingController } from './reviewing.controler';
import { ServiceAccountService } from './service-account.service';
import { AuthParserMiddleware } from './auth-parser/auth-parser.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([OnboardingMerchant])
  ],
  controllers: [RegistrationController, ReviewingController],
  providers: [OnboardingMerchantService, MinioService, ServiceAccountService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthParserMiddleware).forRoutes('registration')
  }
}
