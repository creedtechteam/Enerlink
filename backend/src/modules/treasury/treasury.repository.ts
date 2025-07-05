import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Transaction, Treasury } from '../../../generated/prisma';

@Injectable()
export class TreasuryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string): Promise<Treasury> {
    return this.prisma.treasury.create({
      data: { user_id },
    });
  }

  async findByUserId(user_id: string): Promise<Treasury | null> {
    return this.prisma.treasury.findUnique({ where: { user_id } });
  }

  async credit(user_id: string, amount: number): Promise<Treasury> {
    const treasury = await this.findByUserId(user_id);
    if (!treasury) throw new NotFoundException('Treasury record not found');

    const updated = await this.prisma.treasury.update({
      where: { user_id },
      data: { balance: { increment: amount } },
    });

    await this.logTransaction({
      treasury_id: treasury.id,
      amount,
      type: 'FUND',
      description: 'Deposit or payment received',
    });

    return updated;
  }

  async debit(user_id: string, amount: number): Promise<Treasury> {
    const treasury = await this.findByUserId(user_id);
    if (!treasury) throw new NotFoundException('Treasury record not found');
    if (treasury.balance < amount) throw new Error('Insufficient balance');

    const updated = await this.prisma.treasury.update({
      where: { user_id },
      data: { balance: { decrement: amount } },
    });

    await this.logTransaction({
      treasury_id: treasury.id,
      amount,
      type: 'SPEND',
      description: 'Debit for service or purchase',
    });

    return updated;
  }

  async getBalance(user_id: string): Promise<number> {
    const treasury = await this.findByUserId(user_id);
    return treasury?.balance ?? 0;
  }

  async upsert(user_id: string): Promise<Treasury> {
    return this.prisma.treasury.upsert({
      where: { user_id },
      update: {},
      create: { user_id },
    });
  }

  async logTransaction(params: {
    treasury_id: string;
    amount: number;
    type: 'FUND' | 'SPEND';
    description?: string;
    isp?: string;
    data_plan_id?: string;
    data_plan_description?: string;
  }) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          treasury_id: params.treasury_id,
          amount: params.amount,
          type: params.type,
          isp: params.isp,
          data_plan_id: params.data_plan_id,
          data_plan_description: params.data_plan_description,
          description: params.description,
        },
      });
      return transaction;
    } catch (err: unknown) {
      console.error('Failed to log transaction:', err);
      throw new Error('Failed to log transaction');
    }
  }

  async getTransactions(treasury_id: string): Promise<Transaction[]> {
    try {
      const transactions = await this.prisma.transaction.findMany({
        where: { treasury_id },
        orderBy: { created_at: 'desc' },
      });
      return transactions;
    } catch (err: unknown) {
      console.error('Failed to fetch transactions:', err);
      throw new Error('Failed to fetch transactions');
    }
  }
}
