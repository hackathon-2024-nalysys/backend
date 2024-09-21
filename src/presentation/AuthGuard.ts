import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { createSessionInterface } from './session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const unauthorized = this.reflector.get<boolean>(
      'unauthorized',
      ctx.getHandler(),
    );
    if (unauthorized) return true;

    const req: Request = ctx.switchToHttp().getRequest();
    const session = createSessionInterface(req);
    if (!session.getAccountId()) {
      return false;
    }
    return true;
  }
}
