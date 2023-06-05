import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Affiliate } from '../entities/Affiliate.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateAffiliateDto, UpdateAffiliateDto } from '../dtos/affiliate.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { EventService } from '../../events/services/event.service';
import { RequestContentType } from '../../shared/interfaces/shared.interface';
import { RequestService } from '../../shared/services/request.service';
import { ConfigService } from '@nestjs/config';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

export enum PROFILE_ACTION {
  POST = 'POST',
  UPDATE = 'UPDATE',
}

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    private eventService: EventService,
    private requestService: RequestService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async filterAffiliate(
    filterOptions: FindOptionsWhere<Affiliate>,
    options?: FindOneOptions<Affiliate>,
  ): Promise<Affiliate> {
    try {
      return await this.affiliateRepository.findOne({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async filterAffiliates(
    pagination: DefaultPagination,
    filterOptions?: FindOptionsWhere<Affiliate>,
    options?: FindOneOptions<Affiliate>,
  ): Promise<[Affiliate[], number]> {
    try {
      return await this.affiliateRepository.findAndCount({
        where: filterOptions,
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async addEventAffiliate(affiliate: CreateAffiliateDto): Promise<Affiliate> {
    const event = await this.eventService.filterEvent({ id: affiliate.event });
    if (!event) throw new NotFoundException('Event not found');
    const newAffiliate = await this.affiliateRepository.save({
      fullName: affiliate.fullName,
      profile: uuidv4,
      event: event,
      role: affiliate.role,
      description: affiliate.description,
    });
    this.eventEmitter.emit('upload.affiliate.profile', {
      file: affiliate.profile,
      refId: newAffiliate.profile,
      action: PROFILE_ACTION.POST,
    });
    return newAffiliate;
  }

  async updateEventAffiliate(
    filterOptions: FindOptionsWhere<Affiliate>,
    payload: UpdateAffiliateDto,
  ): Promise<Affiliate> {
    const affiliate = await this.filterAffiliate(filterOptions, {
      relations: ['event'],
    });
    if (!affiliate) throw new NotFoundException('Affiliate not found');
    let event = affiliate.event;
    if (payload.event) {
      const newEvent = await this.eventService.filterEvent({
        id: payload.event,
      });
      if (!newEvent) throw new NotFoundException('Event not found');
      event = newEvent;
    }
    await this.affiliateRepository.update(filterOptions, {
      fullName: payload.fullName ? payload.fullName : affiliate.fullName,
      event: event,
      role: payload.role ? payload.role : affiliate.role,
      description: payload.description
        ? payload.description
        : affiliate.description,
    });
    if (payload.profile) {
      this.eventEmitter.emit('upload.affiliate.profile', {
        file: affiliate.profile,
        refId: affiliate.profile,
        action: PROFILE_ACTION.UPDATE,
      });
    }
    return await this.filterAffiliate(filterOptions);
  }

  @OnEvent('upload.affiliate.profile', { async: true })
  async uploadAffiliateProfileImage(payload: {
    file: any;
    refId: string;
    action: PROFILE_ACTION;
  }): Promise<void> {
    if (PROFILE_ACTION.POST) {
      await this.requestService.postRequest(
        `${this.configService.get<string>('FILE_SERVICE_URL')}/file`,
        { file: payload.file, refId: payload.refId },
        RequestContentType.FORM_DATA,
      );
    } else {
      await this.requestService.patchRequest(
        `${this.configService.get<string>('FILE_SERVICE_URL')}/file`,
        { file: payload.file, refId: payload.refId },
        RequestContentType.FORM_DATA,
      );
    }
  }
}
