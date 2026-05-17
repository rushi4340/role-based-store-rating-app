import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route (set by @Roles decorator)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (attached by JwtGuard)
    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this');
    }

    return true;
  }
}
