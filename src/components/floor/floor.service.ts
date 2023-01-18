import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateFloorBodyDto } from './dto/create-floor.body.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { IFloorRepository } from './interfaces/floor.repository.interface';

@Injectable()
export class FloorService {
  constructor(
    @Inject('IFloorRepository')
    private readonly floorRepository: IFloorRepository,
  ) {}
  async create(request: CreateFloorBodyDto) {
    const floorEntity = this.floorRepository.create(request);
    await this.floorRepository.save(floorEntity);

    return new ResponseBuilder().build();
  }

  findAll() {
    return `This action returns all floor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} floor`;
  }

  update(id: number, updateFloorDto: UpdateFloorDto) {
    return `This action updates a #${id} floor`;
  }

  remove(id: number) {
    return `This action removes a #${id} floor`;
  }
}
