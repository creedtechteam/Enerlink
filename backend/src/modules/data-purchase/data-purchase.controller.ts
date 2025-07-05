import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  DataPurchaseService,
  VTPassVariation,
} from './services/data-purchase.service';
import { BuyDataDto } from './data-purchase.validator';
import {
  PurchaseResponse,
  VTPassVariationDto,
} from './data-purchase.responses';
import { AuthRequest, JwtAuthGuard } from 'src/guards/auth.guard';

@ApiTags('Data Purchase')
@Controller('data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataPurchaseController {
  constructor(private readonly dataPurchase: DataPurchaseService) {}

  @Post('buy')
  @ApiOperation({ summary: 'Purchase a data bundle' })
  @ApiOkResponse({ type: PurchaseResponse })
  async buy(@Body() body: BuyDataDto, @Req() req: AuthRequest) {
    return this.dataPurchase.buy(
      req.user.user_id,
      body.isp_id,
      body.phone_number,
      body.plan_id,
    );
  }

  @Post('plans')
  @ApiOperation({ summary: 'Get available data plans from an ISP' })
  @ApiOkResponse({ type: VTPassVariationDto, isArray: true })
  async fetchPlans(@Body('isp_id') isp_id: string): Promise<VTPassVariation[]> {
    return this.dataPurchase.fetchDataPlans(isp_id);
  }
}
