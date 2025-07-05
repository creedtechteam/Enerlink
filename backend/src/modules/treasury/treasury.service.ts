import { Injectable } from '@nestjs/common';
import { TreasuryRepository } from './treasury.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TreasuryService {
  constructor(
    private readonly treasuryRepo: TreasuryRepository,
    private readonly config: ConfigService,
  ) {}

  async getOrCreate(user_id: string) {
    return this.treasuryRepo.upsert(user_id);
  }

  private getConversionRate(): number {
    return parseFloat(this.config.get<string>('NAIRA_PER_SOL') || '210000');
  }

  async getNairaBalance(userId: string): Promise<number> {
    const treasury = await this.getOrCreate(userId);
    if (!treasury) throw new Error('Treasury not found');

    const rate = this.getConversionRate();
    return treasury.balance * rate;
  }

  async canSpend(userId: string, amountInNaira: number): Promise<boolean> {
    const nairaBalance = await this.getNairaBalance(userId);
    return nairaBalance >= amountInNaira;
  }

  async credit(user_id: string, amountSol: number) {
    await this.getOrCreate(user_id);

    const amountNaira = amountSol * this.getConversionRate();

    // Optionally: log this as a transaction
    await this.treasuryRepo.logTransaction({
      treasury_id: (await this.treasuryRepo.findByUserId(user_id))!.id,
      amount: amountNaira,
      type: 'FUND',
      description: `Credited ${amountSol} SOL (~₦${amountNaira})`,
    });

    return this.treasuryRepo.credit(user_id, amountSol);
  }

  async debit(
    user_id: string,
    amountSol: number,
    meta?: {
      isp?: string;
      data_plan_id?: string;
      data_plan_description?: string;
    },
  ) {
    const treasury = await this.treasuryRepo.findByUserId(user_id);
    if (!treasury) throw new Error('Treasury not found');

    const amountNaira = amountSol * this.getConversionRate();
    const currentNairaBalance = await this.getNairaBalance(user_id);

    if (currentNairaBalance < amountNaira) {
      throw new Error('Insufficient SOL balance (in Naira equivalent)');
    }

    // Optionally: log this as a transaction
    await this.treasuryRepo.logTransaction({
      treasury_id: treasury.id,
      amount: amountNaira,
      type: 'SPEND',
      description: `Debited ${amountSol} SOL (~₦${amountNaira})`,
      ...meta,
    });

    return this.treasuryRepo.debit(user_id, amountSol);
  }

  async getBalance(user_id: string) {
    return this.treasuryRepo.getBalance(user_id);
  }

  async getTransactionHistory(user_id: string) {
    const treasury = await this.treasuryRepo.findByUserId(user_id);
    if (!treasury) throw new Error('Treasury not found');
    return this.treasuryRepo.getTransactions(treasury.id);
  }
}
