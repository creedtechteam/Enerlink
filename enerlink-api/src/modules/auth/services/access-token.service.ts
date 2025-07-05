import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private readonly secret: string | undefined =
    this.config.get('JWT_SECRET') || 'secret';

  async generate(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '24h',
      secret: this.secret,
    });
  }

  decode(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async verify(token: string): Promise<{ sub: string; email: string }> {
    return this.jwtService.verifyAsync(token, {
      secret: this.secret,
    });
  }
}
