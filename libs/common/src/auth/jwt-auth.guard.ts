import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserDto } from '../dto';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

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
        this.authService.send<UserDto>('authenticate', { Authentication: jwt }),
      );

      if (roles) {
        for (const role of roles) {
          if (!user?.roles?.includes(role)) {
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
