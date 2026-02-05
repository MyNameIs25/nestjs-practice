import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMessage } from '../types/auth';

function getCurrentUserByContext(
  context: ExecutionContext,
): UserMessage | undefined {
  const requestType = context.getType();

  if (requestType === 'rpc') {
    return context.switchToRpc().getData().user;
  }

  if (requestType === 'http') {
    return context.switchToHttp().getRequest().user;
  }

  // GraphQL context
  const gqlContext = context.getArgs()[2];

  // Gateway: user is set directly by authContext
  if (gqlContext?.user) {
    return gqlContext.user;
  }

  // Subgraph: user is forwarded via headers from gateway
  const userHeader = gqlContext?.req?.headers?.user;
  if (userHeader && userHeader !== 'null') {
    return JSON.parse(userHeader);
  }

  return undefined;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
