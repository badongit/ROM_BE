import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { FILE_CONSTANT } from '@src/constants/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { removeFile } from '@src/utils/common';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { ICategoryRepository } from '../category/interfaces/category.repository.interface';
import { CreateDishBodyDto } from './dto/request/creat-dish.body.dto';
import { ListDishQueryDto } from './dto/request/list-dish.query.dto';
import { UpdateDishBodyDto } from './dto/request/update-dish.body.dto';
import { DetailDishResponseDto } from './dto/response/detail-dish.response.dto';
import { DishResponseDto } from './dto/response/dish.response.dto';
import { IDishRepository } from './interfaces/dish.repository.interface';
import { IDishService } from './interfaces/dish.service.interface';

@Injectable()
export class DishService implements IDishService {
  constructor(
    @Inject('IDishRepository')
    private readonly dishRepository: IDishRepository,

    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(request: CreateDishBodyDto): Promise<ResponsePayload<any>> {
    const category = await this.categoryRepository.findById(request.categoryId);

    if (!category) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CATEGORY_NOT_FOUND,
      ).toResponse();
    }

    const entity = this.dishRepository.createEntity(request);
    await this.dishRepository.save(entity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async update(
    request: IdParamsDto & UpdateDishBodyDto,
  ): Promise<ResponsePayload<any>> {
    const existed = await this.dishRepository.findById(request.id);
    const oldImage = existed.image;

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.DISH_NOT_FOUND,
      ).toResponse();
    }

    if (request.categoryId) {
      const category = await this.categoryRepository.findById(
        request.categoryId,
      );

      if (!category) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          MessageEnum.CATEGORY_NOT_FOUND,
        ).toResponse();
      }
    }

    const entity = this.dishRepository.updateEntity(existed, request);
    await this.dishRepository.save(entity);

    if (request.image) {
      removeFile(oldImage);
    }

    return new ResponseBuilder().build();
  }

  async list(
    request: ListDishQueryDto,
  ): Promise<ResponsePayload<DishResponseDto>> {
    const [dishes, count] = await this.dishRepository.list(request);

    const dataReturn = plainToClass(DishResponseDto, dishes, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailDishResponseDto | any>> {
    const existed = await this.dishRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.DISH_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailDishResponseDto, existed, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  async delete(request: IdParamsDto): Promise<ResponsePayload<any>> {
    const existed = await this.dishRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.DISH_NOT_FOUND,
      ).toResponse();
    }

    await this.dishRepository.softDelete(request.id);
    return new ResponseBuilder().build();
  }
}
