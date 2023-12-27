import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../../../../apps/auth/src/users/model/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  // request type is graphql
  const user = context.getArgs()[2]?.req.headers?.user;
  if (user) {
    return JSON.parse(user);
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, req: ExecutionContext) => getCurrentUserByContext(req),
);
