import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DataPurchaseController } from './data-purchase.controller';
import { DataPurchaseService } from './services/data-purchase.service';
import { ISPService } from './services/isp.service';
import { ISPPurchaseRepository } from './isp.repository';
import { TreasuryModule } from '../treasury/treasury.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [TreasuryModule, PrismaModule, HttpModule],
  controllers: [DataPurchaseController],
  providers: [DataPurchaseService, ISPService, ISPPurchaseRepository],
  exports: [DataPurchaseService, ISPService],
})
export class DataPurchaseModule {}
