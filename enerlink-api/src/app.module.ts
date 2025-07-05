import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './modules/database/prisma.module';
// import { TxModule } from './modules/tx/tx.module';
// import { ISPModule } from './modules/isp/isp.module';
// import { SwitchBotModule } from './modules/switch-bot/switch-bot.module';
import { validateEnv } from './modules/config/config.validator';
import { OtpModule } from './modules/otp/otp.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { DataPurchaseModule } from './modules/data-purchase/data-purchase.module';
import { TreasuryModule } from './modules/treasury/treasury.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),

    ScheduleModule.forRoot(),
    PrismaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
    OtpModule,
    MailModule,
    AuthModule,
    DataPurchaseModule,
    TreasuryModule,
    // TxModule,
    // ISPModule,
    // SwitchBotModule,
  ],
})
export class AppModule {}
