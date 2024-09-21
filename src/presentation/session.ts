import { Request } from 'express';
import { SessionInterface } from '../application/auth/SessionInterface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function createSessionInterface(req: Request): SessionInterface {
  return {
    setAccount(id: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        req.session.regenerate((error) => {
          if (error) {
            reject(error);
            return;
          }
          req.session.accountId = id;
          resolve();
        });
      });
    },
    getAccountId(): string | null {
      return req.session.accountId ?? null;
    },
    clear(): void {
      req.session.accountId = null;
    },
  };
}

export const CurrentSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return createSessionInterface(req);
  },
);
