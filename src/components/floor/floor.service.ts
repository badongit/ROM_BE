import { ApiError } from 'src/utils/api-error';
import { DetailFloorResponseDto } from './dto/response/detail-floor.response.dto';
import { FloorResponseDto } from './dto/response/floor.response.dto';
import { plainToClass } from 'class-transformer';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ListFloorQueryDto } from './dto/request/list-floor.query.dto';
import { IFloorService } from './interfaces/floor.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from 'src/utils/response-builder';
import { CreateFloorBodyDto } from './dto/request/create-floor.body.dto';
import { UpdateFloorBodyDto } from './dto/request/update-floor.body.dto';
import { IFloorRepository } from './interfaces/floor.repository.interface';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { Equal, Not } from 'typeorm';

@Injectable()
export class FloorService implements IFloorService {
  constructor(
    @Inject('IFloorRepository')
    private readonly floorRepository: IFloorRepository,
  ) {}
  async create(request: CreateFloorBodyDto): Promise<ResponsePayload<any>> {
    const existedFloor = await this.floorRepository.findOne({
      where: { code: request.code },
    });

    if (existedFloor) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.CODE_EXISTED,
      ).toResponse();
    }

    const floorEntity = this.floorRepository.createEntity(request);
    await this.floorRepository.save(floorEntity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async list(
    request: ListFloorQueryDto,
  ): Promise<ResponsePayload<FloorResponseDto>> {
    const [floors, count] = await this.floorRepository.list(request);

    const dataReturn = plainToClass(FloorResponseDto, floors, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<FloorResponseDto>({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailFloorResponseDto | any>> {
    const floor = await this.floorRepository.findById(request.id);

    if (!floor) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.FLOOR_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailFloorResponseDto, floor, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<DetailFloorResponseDto>(dataReturn).build();
  }

  async update(
    request: IdParamsDto & UpdateFloorBodyDto,
  ): Promise<ResponsePayload<any>> {
    const floor = await this.floorRepository.findById(request.id);

    if (!floor) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.FLOOR_NOT_FOUND,
      ).toResponse();
    }

    const existedFloor = await this.floorRepository.findOne({
      where: { code: request.code, id: Not(Equal(request.id)) },
    });

    if (existedFloor) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.CODE_EXISTED,
      ).toResponse();
    }

    await this.floorRepository.save(floor);

    return new ResponseBuilder().build();
  }

  async delete(request: IdParamsDto): Promise<ResponsePayload<any>> {
    const floor = await this.floorRepository.findById(request.id);

    if (!floor) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.FLOOR_NOT_FOUND,
      ).toResponse();
    }

    await this.floorRepository.softRemove(floor);

    return new ResponseBuilder().build();
  }
}
