import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import * as crypto from 'crypto';
import { RefreshToken } from 'generated/prisma';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly repo: RefreshTokenRepository) {}

  private readonly ttlMs = 1000 * 60 * 60 * 24 * 7;
  private readonly hashAlgorithm = 'sha256';

  private hashToken(t: string) {
    return crypto.createHash(this.hashAlgorithm).update(t).digest('hex');
  }

  private gen() {
    return crypto.randomBytes(40).toString('hex');
  }

  private exp() {
    return new Date(Date.now() + this.ttlMs);
  }

  async create(userId: string): Promise<{ token: string; device_id: string }> {
    const raw = this.gen();
    const deviceId = this.gen();
    await this.repo.deleteByUserAndDevice(userId, deviceId);
    await this.repo.create({
      user_id: userId,
      device_id: deviceId,
      token: this.hashToken(raw),
      expires_at: this.exp(),
    });
    return { token: raw, device_id: deviceId };
  }

  async rotate(userId: string, deviceId: string): Promise<{ token: string }> {
    const doc = await this.repo.findByUserAndDevice(userId, deviceId);
    if (doc) await this.repo.deleteById(doc.id);
    const { token } = await this.create(userId);
    return { token };
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repo.findByToken(this.hashToken(token));
  }

  async destroy(token: string, hashed: boolean = false) {
    const hash = hashed ? token : this.hashToken(token);
    const doc = await this.repo.findByToken(hash);
    if (doc) await this.repo.deleteById(doc.id);
  }

  async validate(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const doc = await this.repo.findByToken(this.hashToken(token));
    if (!doc) return false;
    if (doc.user_id !== userId || doc.device_id !== deviceId) return false;
    return doc.expires_at.getTime() > Date.now();
  }

  async findByUserId(
    userId: string,
    deviceId: string,
  ): Promise<RefreshToken | null> {
    return this.repo.findByUserAndDevice(userId, deviceId);
  }

  async purgeExpired() {
    return this.repo.purgeExpired();
  }

  async destroyAllExcept(userId: string, deviceId: string) {
    await this.repo.deleteAllExcept(userId, deviceId);
  }
}
