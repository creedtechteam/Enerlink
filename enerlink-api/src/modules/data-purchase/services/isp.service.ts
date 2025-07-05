import { Injectable } from '@nestjs/common';
import { ISPPurchaseRepository } from '../isp.repository';

@Injectable()
export class ISPService {
  constructor(private readonly repo: ISPPurchaseRepository) {}

  async switchISP(userId: string, ispId: string) {
    console.log(`🔄 Switching user ${userId} to ISP ${ispId}`);
    await new Promise((res) => setTimeout(res, 200));
    console.log(`✅ Switched.`);
  }

  async provisionData(
    userId: string,
    planId: string,
    ispId: string,
    phoneNumber: string,
    amount: number,
  ) {
    console.log(`📡 Provisioning ${planId} from ${ispId} for ${userId}`);
    await new Promise((res) => setTimeout(res, 300));
    console.log(`✅ Provisioned.`);

    await this.repo.create({
      user_id: userId,
      phone_number: phoneNumber,
      data_or_airtime: 'data',
      amount,
      plan_id: planId,
      isp: ispId,
    });
  }
}
