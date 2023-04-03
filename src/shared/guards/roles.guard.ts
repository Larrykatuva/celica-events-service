import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Request } from 'express';
import { User } from '../entities/user.entity';
import { ROLE } from '../interfaces/roles.interfaces';
import { RoleService } from '../services/role.service';

/**
 * RolesGuard class which will compare the roles assigned to the current user
 * to the actual roles required by the current route being processed.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user: User = request['user'];
    const setRoles = await this.rolesService.getUserRoles(user.sub);
    return requiredRoles.some((role) => setRoles?.includes(role));
  }
}
