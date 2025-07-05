import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../../../../generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    agreed_version?: string;
  }): Promise<User> {
    const {
      first_name,
      last_name,
      email,
      password,
      agreed_version = 'v1',
    } = params;

    return this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password,
        agreed_version,
        agreed_at: new Date(),
      },
    });
  }

  async setAgreedVersion(
    user_id: string,
    agreed_version: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: user_id },
      data: { agreed_version, agreed_at: new Date() },
    });
  }

  async setPassword(user_id: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: user_id },
      data: { password },
    });
  }

  async setWalletAddress(
    User_id: string,
    wallet_address: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: User_id },
      data: { wallet_address },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByWallet(wallet_address: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { wallet_address },
    });
  }

  async findById(user_id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: user_id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async setVerified(user: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: user },
      data: { verified: true },
    });
  }
}
