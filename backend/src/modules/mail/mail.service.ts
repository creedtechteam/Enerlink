import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendOtp(
    email: string,
    name: string,
    token: number,
    action: string,
  ): Promise<SentMessageInfo> {
    return await this.mailer.sendMail({
      to: email,
      subject: action.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
        letter.toUpperCase(),
      ),
      template: 'otp',
      context: {
        name,
        token,
        action,
      },
    });
  }

  async sendWelcome(email: string, name: string): Promise<SentMessageInfo> {
    return this.mailer.sendMail({
      to: email,
      subject: 'Welcome to Enerlink!',
      template: 'welcome',
      context: {
        name,
      },
    });
  }
}
