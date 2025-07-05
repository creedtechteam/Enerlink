import { Module } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';

@Module({
  providers: [OtpRepository, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
