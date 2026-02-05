import { UnauthorizedException } from '@nestjs/common';
import { app } from './app';
import { AUTH_SERVICE_NAME, AuthServiceClient, UserMessage } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export const authContext = async ({ req }): Promise<{ user: UserMessage }> => {
  try {
    const authHeader =
      req.cookies?.Authentication || req.headers?.authentication;
    if (!authHeader) {
      throw new UnauthorizedException('No authentication header');
    }

    const grpcClient = app.get<ClientGrpc>(AUTH_SERVICE_NAME);
    const authService =
      grpcClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);

    const user = await lastValueFrom(
      authService.authenticate({ Authentication: authHeader }),
    );

    return { user };
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};
