import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { OrganizerService } from './organizer.service';
import { RequestService } from './request.service';
import { ConfigService } from '@nestjs/config';
import {
  PaginatedRequestResponse,
  ROLE,
  UserRole,
} from '../interfaces/roles.interfaces';

@Injectable()
export class RoleService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private organizerService: OrganizerService,
    private requestService: RequestService,
    private configService: ConfigService,
  ) {}

  /**
   * Get user roles from the organizer service by making a get request.
   * Application token must be passed in the request.
   * @param sub
   */
  async getUserRoles(sub: string): Promise<string[]> {
    const roles = await this.cacheService.get<string[]>(`${sub}_ROLES`);
    if (roles) return roles;
    const appToken = await this.organizerService.getAppToken();
    const { data } = await this.requestService.getRequest<
      PaginatedRequestResponse<UserRole>
    >(
      `${this.configService.get<string>('ORGANIZER_URL')}/user/role/${sub}`,
      appToken,
    );
    const userRoles = data.data.map((role) => role.name);
    await this.cacheService.set(
      `${sub}_ROLES`,
      userRoles,
      this.configService.get<number>('CACHE_DURATION'),
    );
    return userRoles;
  }

  /**
   * Check if user is celica staff.
   * @param sub
   */
  async isCelicaStaff(sub: string): Promise<boolean> {
    const requiredRoles = [ROLE.SUPER_ADMIN, ROLE.SUPPORT, ROLE.BUSINESS];
    const setRoles = await this.getUserRoles(sub);
    return requiredRoles.some((role) => setRoles?.includes(role));
  }
}
