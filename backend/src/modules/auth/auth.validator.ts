import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ description: "User's first name" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: "User's last name" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Account password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class SignInDto {
  @ApiProperty({ description: 'Registered email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Account password' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Identifier of the user resetting password' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'OTP token sent to the user' })
  @IsNumber()
  token: number;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(6)
  new_password: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'Identifier of the user verifying OTP' })
  @IsString()
  user_id: string;

  @ApiProperty({ description: 'OTP token to verify' })
  @IsNumber()
  token: number;
}
