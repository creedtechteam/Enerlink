import { IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyDataDto {
  @ApiProperty({ description: 'ID of the purchasing user' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'Identifier of the data plan to purchase' })
  @IsString()
  plan_id: string;

  @ApiProperty({ description: 'ID of the ISP providing the data plan' })
  @IsString()
  isp_id: string;

  @ApiProperty({ description: 'Recipient phone number' })
  @IsString()
  @IsPhoneNumber('NG')
  phone_number: string;
}
