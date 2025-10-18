import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

//customize decorator for whilelist AuthGuard('jwt')
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

//decorator req.user
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

//decorator custom message response
export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);
