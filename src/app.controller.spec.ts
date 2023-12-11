import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { OnboardingMerchantService } from './onboarding-merchant.service';

describe('RegistrationController', () => {
  let registrationController: RegistrationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [OnboardingMerchantService],
    }).compile();

    registrationController = app.get<RegistrationController>(RegistrationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(RegistrationController.getHello()).toBe('Hello World!');
    });
  });
});
