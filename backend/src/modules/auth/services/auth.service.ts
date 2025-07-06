import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { OtpService } from '../../otp/otp.service';
import { RefreshTokenService } from './refresh-token.service';
import { AccessTokenService } from './access-token.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpService: OtpService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly events: EventEmitter2,
  ) {}

  async signUp(params: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepo.findByEmail(params.email);
    if (existing) throw new BadRequestException('Email already in use');

    const hash = await bcrypt.hash(params.password, 10);
    const user = await this.userRepo.createUser({
      ...params,
      password: hash,
    });

    const token = await this.otpService.generate(user.id);
    this.events.emit('user.created', { user, otp: { token } });
    const access = await this.accessTokenService.generate(user);
    const { token: refresh, device_id } = await this.refreshTokenService.create(
      user.id,
    );

    return { message: 'Check your email for a verification code', access_token: access, refresh_token: refresh, device_id  };
  }

  async addWalletAddress(user_id: string, address: string) {
    return this.userRepo.setWalletAddress(user_id, address);
  }

  async signInWithWalletAddress(wallet_address: string) {
    const user = await this.userRepo.findByWallet(wallet_address);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const access = await this.accessTokenService.generate(user);
    const { token: refresh, device_id } = await this.refreshTokenService.create(
      user.id,
    );

    return { access_token: access, refresh_token: refresh, device_id };
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const access = await this.accessTokenService.generate(user);
    const { token: refresh, device_id } = await this.refreshTokenService.create(
      user.id,
    );

    return { access_token: access, refresh_token: refresh, device_id };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const token = await this.otpService.generate(user.id);
    this.events.emit('user.forgot-password', { user, otp: { token } });
  }

  async resetPassword(user_id: string, token: number, new_password: string) {
    await this.otpService.verify(user_id, token);
    const hash = await bcrypt.hash(new_password, 10);
    await this.userRepo.setPassword(user_id, hash);
  }

  async verifyEmail(user_id: string, token: number) {
    await this.otpService.verify(user_id, token);
    const user = await this.userRepo.setVerified(user_id);
    this.events.emit('user.verified', user);
  }

  async resendVerifEmail(user_id: string) {
    const user = await this.userRepo.findById(user_id);
    if (!user) throw new BadRequestException('User not found');

    const token = await this.otpService.generate(user.id);
    this.events.emit('user.created', { user, otp: { token } });
  }

  async logout(user_id: string, token: string, device_id: string) {
    const valid = await this.refreshTokenService.validate(
      token,
      user_id,
      device_id,
    );
    if (!valid) throw new UnauthorizedException('Invalid session');

    await this.refreshTokenService.destroy(token);
  }

  async refreshToken(
    refresh_token: string,
    user_id: string,
    device_id: string,
  ) {
    const valid = await this.refreshTokenService.validate(
      refresh_token,
      user_id,
      device_id,
    );
    if (!valid) throw new UnauthorizedException('Invalid refresh session');

    const session = await this.refreshTokenService.findByToken(refresh_token);

    if (!session) throw new UnauthorizedException('Invalid refresh session');
    const user = await this.userRepo.findById(session.user_id);
    if (!user) throw new UnauthorizedException('User not found');

    return {
      access_token: await this.accessTokenService.generate(user),
    };
  }
  async logoutAllExcept(user_id: string, device_id: string) {
    const current = await this.refreshTokenService.findByUserId(
      user_id,
      device_id,
    );
    if (!current) throw new UnauthorizedException('Invalid credentials');

    await this.refreshTokenService.destroyAllExcept(user_id, device_id);
  }
}
