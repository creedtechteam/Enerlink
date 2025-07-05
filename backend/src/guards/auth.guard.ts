import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    user_id: string;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
