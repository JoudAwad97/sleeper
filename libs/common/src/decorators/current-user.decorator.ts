import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../../../apps/auth/src/users/model/user.entity';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, req: ExecutionContext) => getCurrentUserByContext(req),
);
