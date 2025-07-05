import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { OtpRepository } from '../otp/otp.repository';
import { AccessTokenService } from './services/access-token.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { OtpService } from '../otp/otp.service';
import { PrismaService } from '../database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ConfigModule, JwtModule.register({}), OtpModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenService,
    RefreshTokenService,
    OtpService,
    UserRepository,
    RefreshTokenRepository,
    OtpRepository,
    PrismaService,
    JwtStrategy,
  ],
})
export class AuthModule {}
