import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { AuthRequest, JwtAuthGuard } from '../../guards/auth.guard';
import {
  SignUpDto,
  SignInDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './auth.validator';
import {
  MessageResponse,
  SignInResponse,
  RefreshTokenResponse,
} from './auth.responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiCreatedResponse({ type: MessageResponse })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  @ApiOkResponse({ type: SignInResponse })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('signin-with-wallet-address')
  @ApiOperation({ summary: 'Authenticate user with wallet address' })
  @ApiOkResponse({ type: SignInResponse })
  signInWithWalletAddress(@Body('wallet_address') wallet_address: string) {
    return this.authService.signInWithWalletAddress(wallet_address);
  }

  @Post('add-wallet-address')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add wallet address to user' })
  @ApiOkResponse({ type: MessageResponse })
  addWalletAddress(@Req() req: AuthRequest, @Body('address') address: string) {
    return this.authService.addWalletAddress(req.user.user_id, address);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset instructions' })
  @ApiOkResponse({ description: 'OTP sent if email exists' })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiOkResponse({ description: 'Password reset successfully' })
  reset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.user_id,
      dto.token,
      dto.new_password,
    );
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email using OTP' })
  @ApiOkResponse({ description: 'Email verified' })
  verify(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyEmail(dto.user_id, dto.token);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiOkResponse({ description: 'Verification email resent' })
  resend(@Body('user_id') user_id: string) {
    return this.authService.resendVerifEmail(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout from current device' })
  @ApiOkResponse({ description: 'Logged out successfully' })
  logout(
    @Body() dto: { token: string; device_id: string },
    @Req() req: AuthRequest,
  ) {
    return this.authService.logout(req.user.user_id, dto.token, dto.device_id);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({ type: RefreshTokenResponse })
  refreshToken(
    @Body() dto: { refresh_token: string; device_id: string; user_id: string },
  ) {
    return this.authService.refreshToken(
      dto.refresh_token,
      dto.user_id,
      dto.device_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout-all-but')
  @ApiOperation({ summary: 'Logout from all devices except the provided one' })
  @ApiOkResponse({ description: 'Logged out of other devices' })
  logoutAll(@Body() dto: { device_id: string }, @Req() req: AuthRequest) {
    return this.authService.logoutAllExcept(req.user.user_id, dto.device_id);
  }
}
