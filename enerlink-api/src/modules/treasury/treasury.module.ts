import { Module } from '@nestjs/common';
import { TreasuryRepository } from './treasury.repository';
import { TreasuryService } from './treasury.service';
import { PrismaService } from '../database/prisma.service';
import { TreasuryListener } from './treasury.listener';
import { TreasuryController } from './treasury.controller';

@Module({
  controllers: [TreasuryController],
  providers: [
    PrismaService,
    TreasuryRepository,
    TreasuryService,
    TreasuryListener,
  ],
  exports: [TreasuryService],
})
export class TreasuryModule {}
