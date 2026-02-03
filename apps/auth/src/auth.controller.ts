import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
  UserMessage,
} from '@app/common';
import type { Authentication } from '@app/common';
import { CurrentUser } from '@app/common';
import type { Response } from 'express';
import { Payload } from '@nestjs/microservices';

@AuthServiceControllerMethods()
@Controller('auth')
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  async authenticate(@Payload() data: Authentication): Promise<UserMessage> {
    const user = await this.authService.verifyToken(data.Authentication);
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles?.map((role) => ({ id: role.id, name: role.name })) ?? [],
    };
  }
}
