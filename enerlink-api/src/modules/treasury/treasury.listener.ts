import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TreasuryService } from './treasury.service';
import { User } from 'generated/prisma';

@Injectable()
export class TreasuryListener implements OnModuleInit {
  constructor(private treasuryService: TreasuryService) {}

  onModuleInit() {
    console.log('Treasury listener initialized ✅');
  }

  @OnEvent('user.created')
  async handleUserCreated(payload: { user: User }) {
    await this.treasuryService.getOrCreate(payload.user.id);
    console.log(`🪙 Wallet created for user ${payload.user.id}`);
  }
}
