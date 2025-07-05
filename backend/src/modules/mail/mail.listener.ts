import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { Otp, User } from 'generated/prisma';

@Injectable()
export class MailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.created')
  async handleUserCreated({ user, otp }: { user: User; otp: Otp }) {
    await this.mailService.sendOtp(
      user.email,
      `${user.first_name}`,
      otp.token,
      'verify your email',
    );
  }

  @OnEvent('user.forgot-password')
  async handleUserForgot({ user, otp }: { user: User; otp: Otp }) {
    await this.mailService.sendOtp(
      user.email,
      `${user.first_name}`,
      otp.token,
      'reset your password',
    );
  }

  @OnEvent('user.verified')
  async handleUserVerified({ user }: { user: User }) {
    await this.mailService.sendWelcome(user.email, `${user.first_name}`);
  }
}
