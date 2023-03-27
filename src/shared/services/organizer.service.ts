import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  GRANT_TYPE,
  RequestContentType,
  TCP_Action,
  TokenInterface,
  TransportAction,
} from '../interfaces/shared.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizer } from '../entities/organizer.entity';
import { Repository, UpdateResult } from 'typeorm';
import { RequestService } from './request.service';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    private requestService: RequestService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private configService: ConfigService,
  ) {}

  async filterOrganizer(filterOptions: any): Promise<Organizer> {
    return await this.organizerRepository.findOne({
      where: { ...filterOptions },
    });
  }

  /**
   * Perform action from transport event.
   * @param transportAction
   */
  async transportAction(
    transportAction: TransportAction<any>,
  ): Promise<Organizer | UpdateResult> {
    console.log(transportAction);
    switch (transportAction.action) {
      case TCP_Action.CREATE: {
        return await this.createOrganizer(transportAction.data);
      }
      case TCP_Action.UPDATE: {
        return await this.updateOrganizer(transportAction.data);
      }
      default: {
        break;
      }
    }
  }

  async createOrganizer(organizer: Organizer): Promise<Organizer> {
    try {
      return await this.organizerRepository.save(organizer);
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrganizer(data: {
    sub: string;
    updateData: Partial<Organizer>;
  }): Promise<UpdateResult> {
    return await this.organizerRepository.update(
      { sub: data.sub },
      { ...data.updateData },
    );
  }

  /**
   * Get application authentication token. Check if token already exists in the
   * cache and return it else make a post request to auth service for a new access token.
   */
  async getAppToken(): Promise<any> {
    const token = await this.cacheService.get<TokenInterface>(
      `${this.configService.get<string>('SERVICE_NAME')}_TOKEN`,
    );
    if (token) return token.access_token;
    const { data } = await this.requestService.postRequest<TokenInterface>(
      `${this.configService.get<string>('AUTH_URL')}/token`,
      {
        grant_type: GRANT_TYPE.CLIENT_CREDENTIALS,
        client_id: this.configService.get<string>('CLIENT_ID'),
        client_secret: this.configService.get<string>('CLIENT_SECRET'),
      },
      RequestContentType.FORM_URLENCODED,
    );
    await this.cacheService.set(
      `${this.configService.get<string>('SERVICE_NAME')}_TOKEN`,
      data,
      this.configService.get<number>('CACHE_DURATION'),
    );
    return data.access_token;
  }

  /**
   * Verify an access token by calling celica auth service.
   * @param token
   */
  async verifyAppToken(token: string): Promise<boolean> {
    try {
      const { data } = await this.requestService.postRequest<{
        valid: boolean;
      }>(
        `${this.configService.get<string>('AUTH_URL')}/token`,
        { token: token },
        RequestContentType.FORM_URLENCODED,
        await this.getAppToken(),
      );
      return !!data.valid;
    } catch (error) {
      return false;
    }
  }
}
