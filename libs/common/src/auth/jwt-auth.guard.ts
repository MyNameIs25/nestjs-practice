import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!jwt) {
      this.logger.warn('No authentication token found');
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    try {
      const user = await firstValueFrom(
        this.authService.authenticate({ Authentication: jwt }),
      );

      if (roles) {
        for (const role of roles) {
          if (!user?.roles?.map((role) => role.name).includes(role)) {
            this.logger.warn(`User ${user.email} does not have role ${role}`);
            throw new UnauthorizedException('User does not have required role');
          }
        }
      }

      context.switchToHttp().getRequest().user = user;
      return true;
    } catch {
      this.logger.warn('User authentication failed');
      return false;
    }
  }
}
