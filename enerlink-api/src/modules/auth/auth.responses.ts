import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty()
  message: string;
}

export class SignInResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  device_id: string;
}

export class RefreshTokenResponse {
  @ApiProperty()
  access_token: string;
}
