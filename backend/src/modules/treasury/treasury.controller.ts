import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TreasuryService } from './treasury.service';
import { AuthRequest, JwtAuthGuard } from 'src/guards/auth.guard';
import { TreasuryDto, TransactionDto } from './treasury.responses';

@ApiTags('Treasury')
@Controller('treasury')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TreasuryController {
  constructor(private treasuryService: TreasuryService) {}

  @Get(':userId/wallet')
  @ApiOperation({ summary: 'Retrieve user wallet or create one if absent' })
  @ApiOkResponse({ type: TreasuryDto })
  async getWallet(@Req() req: AuthRequest) {
    return this.treasuryService.getOrCreate(req.user.user_id);
  }

  @Get(':userId/transactions')
  @ApiOperation({ summary: 'Fetch wallet transaction history' })
  @ApiOkResponse({ type: TransactionDto, isArray: true })
  async getTransactions(@Req() req: AuthRequest) {
    return this.treasuryService.getTransactionHistory(req.user.user_id);
  }
}
