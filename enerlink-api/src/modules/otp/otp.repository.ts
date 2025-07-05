import { Otp } from './../../../generated/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOtp(params: {
    user_id: string;
    token: number;
    expires_at: Date;
  }): Promise<Otp> {
    return this.prisma.otp.create({ data: params });
  }

  async findValidOtp(user_id: string, token: number): Promise<Otp | null> {
    return this.prisma.otp.findFirst({
      where: {
        user_id,
        token,
        expires_at: { gt: new Date() },
      },
    });
  }

  async deleteOtp(id: string): Promise<void> {
    await this.prisma.otp.delete({ where: { id } });
  }

  async purgeExpired(): Promise<number> {
    const { count } = await this.prisma.otp.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });
    return count;
  }
}
