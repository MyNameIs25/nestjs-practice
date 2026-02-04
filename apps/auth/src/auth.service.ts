import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@app/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async verifyToken(jwt: string): Promise<User> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(jwt);
      return this.usersService.getUser({ id: payload.userId });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return user;
  }
}
