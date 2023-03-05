import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { ApiError } from '@src/utils/api-error';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        err ||
        new ApiError(
          ResponseCodeEnum.UNAUTHORIZED,
          MessageEnum.UNAUTHORIZED,
        ).toResponse()
      );
    }

    return user;
  }
}
