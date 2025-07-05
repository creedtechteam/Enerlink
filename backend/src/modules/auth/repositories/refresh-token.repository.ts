import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RefreshToken } from 'generated/prisma';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    user_id: string;
    device_id: string;
    token: string;
    expires_at: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }

  async findByUserAndDevice(
    user_id: string,
    device_id: string,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { user_id, device_id },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({ where: { id } });
  }

  async deleteByUserAndDevice(
    user_id: string,
    device_id: string,
  ): Promise<number> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { user_id, device_id },
    });
    return count;
  }

  async purgeExpired(): Promise<number> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });
    return count;
  }

  async deleteAllExcept(user_id: string, device_id: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { user_id, NOT: { device_id } },
    });
  }
}
