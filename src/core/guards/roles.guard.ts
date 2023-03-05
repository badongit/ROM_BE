import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRole || user?.role?.code === RoleEnum.ADMIN) {
      return true;
    }

    return requiredRole.some((role) => role === user?.role?.code);
  }
}
