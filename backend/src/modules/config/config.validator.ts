import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  validateSync,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnvVars {
  @ApiProperty({ description: 'Secret used to sign JWT tokens' })
  @IsString()
  JWT_SECRET: string;

  @ApiProperty({ description: 'Connection URL for the database' })
  @IsString()
  DATABASE_URL: string;

  @ApiProperty({ description: 'SMTP host for outgoing mail' })
  @IsString()
  MAIL_HOST: string;

  @ApiProperty({ description: 'SMTP port' })
  @IsNumber()
  MAIL_PORT: number;

  @ApiProperty({ description: 'SMTP username' })
  @IsString()
  MAIL_USER: string;

  @ApiProperty({ description: 'SMTP password' })
  @IsString()
  MAIL_PASS: string;

  @ApiProperty({ description: 'Default FROM address for emails' })
  @IsString()
  MAIL_FROM: string;

  @ApiProperty({
    required: false,
    description: 'OTP time to live in milliseconds',
  })
  @IsOptional()
  @IsNumber()
  OTP_TTL_MS?: number;

  @ApiProperty({
    required: false,
    description: 'Length of generated OTP tokens',
  })
  @IsOptional()
  @IsNumber()
  OTP_LENGTH?: number;

  @ApiProperty({
    enum: ['development', 'production', 'test'],
    description: 'Node environment',
  })
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string;

  @ApiProperty({
    required: false,
    description: 'Conversion rate of Naira to SOL',
  })
  @IsOptional()
  @IsNumberString()
  NAIRA_PER_SOL: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Config validation failed: ${errors.toString()}`);
  }

  return validated;
}
