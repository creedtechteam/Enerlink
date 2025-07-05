import { Injectable, ForbiddenException, HttpException } from '@nestjs/common';
import { TreasuryService } from '../../treasury/treasury.service';
import { ISPService } from './isp.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

export interface VTPassVariation {
  name: string;
  variation_code: string;
  amount: number | string;
  fixedPrice: boolean;
}

interface VTPassResponse {
  content: {
    serviceID: string;
    variations: VTPassVariation[];
  };
}

@Injectable()
export class DataPurchaseService {
  constructor(
    private readonly treasury: TreasuryService,
    private readonly isp: ISPService,
    private readonly httpService: HttpService,
  ) {}

  private getISPServiceID(ispId: string): string {
    const map: Record<string, string> = {
      mtn: 'mtn-data',
      airtel: 'airtel-data',
      glo: 'glo-data',
      etisalat: 'etisalat-data',
    };
    return map[ispId] ?? '';
  }

  async fetchDataPlans(ispId: string): Promise<VTPassVariation[]> {
    const serviceID = this.getISPServiceID(ispId);
    if (!serviceID) throw new Error('Invalid ISP');

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<VTPassResponse>(
          `https://vtpass.com/api/service-variations?serviceID=${serviceID}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return data?.content?.variations || [];
    } catch (err) {
      console.log(err);
      throw new HttpException('Failed to fetch data plans from VTPass', 502);
    }
  }

  async buy(
    userId: string,
    phoneNumber: string,
    planId: string,
    ispId: string,
  ) {
    const variations = await this.fetchDataPlans(ispId);
    const plan = variations.find((v) => v.variation_code === planId);

    if (!plan) throw new Error('Invalid plan for selected ISP');

    const nairaAmount =
      typeof plan.amount === 'string' ? parseFloat(plan.amount) : plan.amount;
    if (isNaN(nairaAmount)) throw new Error('Invalid amount received');

    const canSpend = await this.treasury.canSpend(userId, nairaAmount);
    if (!canSpend) throw new ForbiddenException('Insufficient balance');

    const amountInSol = nairaAmount / 210_000;

    await this.treasury.debit(userId, amountInSol, {
      isp: ispId,
      data_plan_id: planId,
      data_plan_description: plan.name,
    });
    await this.isp.switchISP(userId, ispId);
    await this.isp.provisionData(
      userId,
      planId,
      ispId,
      phoneNumber,
      nairaAmount,
    );

    return { message: `✅ Bought ${plan.name} for ₦${nairaAmount}` };
  }
}
