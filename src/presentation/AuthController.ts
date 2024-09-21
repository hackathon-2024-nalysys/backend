import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, LoginUsecase } from '../application/auth/LoginUsecase';
import { createSessionInterface, CurrentSession } from './session';
import { Session } from 'inspector/promises';
import { SessionInterface } from '../application/auth/SessionInterface';
import { Request } from 'express';
import { Unauthorized } from './authDecorators';

@Controller('/v1/auth/')
export class AuthController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Unauthorized()
  @Post('login')
  async login(
    @Body() input: LoginInput,
    @CurrentSession() session: SessionInterface,
  ) {
    const result = await this.loginUsecase.login(session, input);
    if (!result)
      throw new UnauthorizedException(
        'ユーザー名またはパスワードが間違っています',
      );
  }
}
