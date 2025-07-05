import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ISPPurchaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    user_id: string;
    phone_number: string;
    data_or_airtime: 'data' | 'airtime';
    amount: number;
    plan_id?: string;
    isp: string;
  }) {
    return this.prisma.ispPurchase.create({
      data,
    });
  }

  async findByUser(user_id: string) {
    return this.prisma.ispPurchase.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findRecent(limit = 10) {
    return this.prisma.ispPurchase.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }
}
