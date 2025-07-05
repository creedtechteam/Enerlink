import { Injectable, BadRequestException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  private readonly ttlMs: number;
  private readonly length: number;

  constructor(
    private readonly otpRepo: OtpRepository,
    private readonly config: ConfigService,
  ) {
    this.ttlMs = +this.config.get('OTP_TTL_MS', '900000');
    this.length = +this.config.get('OTP_LENGTH', '6');
  }

  async generate(user_id: string): Promise<number> {
    const token = this.randomToken(this.length);
    const expires_at = new Date(Date.now() + this.ttlMs);

    await this.otpRepo.createOtp({ user_id, token, expires_at });
    return token;
  }

  async verify(user_id: string, token: number): Promise<void> {
    const otp = await this.otpRepo.findValidOtp(user_id, token);
    if (!otp) throw new BadRequestException('Invalid or expired OTP');

    await this.otpRepo.deleteOtp(otp.id);
  }

  private randomToken(len: number): number {
    const max = 10 ** len;
    const num = randomInt(0, max);
    return num;
  }
}
