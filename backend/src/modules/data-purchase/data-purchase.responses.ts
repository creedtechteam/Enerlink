import { ApiProperty } from '@nestjs/swagger';

export class PurchaseResponse {
  @ApiProperty()
  message: string;
}

export class VTPassVariationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  variation_code: string;

  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'number' }] })
  amount: number | string;

  @ApiProperty()
  fixedPrice: boolean;
}
