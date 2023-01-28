import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { StoreResponseDto } from './dto/store.response.dto';
import { UpdateStoreBodyDto } from './dto/update-store.body.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async detail(): Promise<ResponsePayload<StoreResponseDto>> {
    const store = await this.storeRepository.find();

    const dataReturn = plainToClass(StoreResponseDto, store[0], {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async update(request: UpdateStoreBodyDto) {
    await this.storeRepository.update({}, request);

    return new ResponseBuilder().build();
  }
}
