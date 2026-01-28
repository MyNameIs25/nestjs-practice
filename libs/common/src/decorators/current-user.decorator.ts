import { createParamDecorator, ExecutionContext, } from "@nestjs/common";
import { UserDocument } from "../../../../apps/auth/src/users/models/user.schema";

function getCurrentUserByContext(context: ExecutionContext): UserDocument {
    const ctx = context.switchToHttp();
    return ctx.getRequest().user;
}

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context));
