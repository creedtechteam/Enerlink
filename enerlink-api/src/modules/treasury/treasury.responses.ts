import { ApiProperty } from '@nestjs/swagger';

export class TreasuryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  balance: number;
}

export class TransactionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  treasury_id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ['FUND', 'SPEND'] })
  type: 'FUND' | 'SPEND';

  @ApiProperty({ required: false })
  isp?: string;

  @ApiProperty({ required: false })
  data_plan_id?: string;

  @ApiProperty({ required: false })
  data_plan_description?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  created_at: Date;
}
