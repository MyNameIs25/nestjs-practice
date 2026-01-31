import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      return false;
    }
    try {
      const user = await firstValueFrom(
        this.authService.send<UserDto>('authenticate', { Authentication: jwt }),
      );
      context.switchToHttp().getRequest().user = user;
      return true;
    } catch {
      return false;
    }
  }
}
