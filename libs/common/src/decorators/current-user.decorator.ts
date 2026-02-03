import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../models/user.entity';

function getCurrentUserByContext(context: ExecutionContext): User {
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
  return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
