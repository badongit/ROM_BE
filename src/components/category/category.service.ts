import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CategoryRepository } from '@src/repositories/category.repository';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { Equal, ILike, Not } from 'typeorm';
import { CreateCategoryBodyDto } from './dto/request/create-category.body.dto';
import { ListCategoryQueryDto } from './dto/request/list-category.query.dto';
import { UpdateCategoryBodyDto } from './dto/request/update-category.body.dto';
import { CategoryResponseDto } from './dto/response/category.response.dto';
import { DetailCategoryResponseDto } from './dto/response/detail-category.response.dto';
import { ICategoryService } from './interfaces/category.service.interface';
import { removeFile } from '@src/utils/common';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(request: CreateCategoryBodyDto): Promise<ResponsePayload<any>> {
    const existed = await this.categoryRepository.findOne({
      where: { name: ILike(request.name) },
      withDeleted: true,
    });

    if (existed) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.NAME_EXISTED,
      )
        .withErrors({ name: MessageEnum.NAME_EXISTED })
        .toResponse();
    }

    const entity = this.categoryRepository.createEntity(request);
    await this.categoryRepository.save(entity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async list(
    request: ListCategoryQueryDto,
  ): Promise<ResponsePayload<CategoryResponseDto>> {
    const [categories, count] = await this.categoryRepository.list(request);

    const dataReturn = plainToClass(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailCategoryResponseDto | any>> {
    const category = await this.categoryRepository.findById(request.id);

    if (!category) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CATEGORY_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailCategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async update(
    request: IdParamsDto & UpdateCategoryBodyDto,
  ): Promise<ResponsePayload<any>> {
    const existed = await this.categoryRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CATEGORY_NOT_FOUND,
      ).toResponse();
    }

    const existedName = await this.categoryRepository.findOne({
      where: { name: request.name, id: Not(Equal(request.id)) },
      withDeleted: true,
    });

    if (existedName) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.NAME_EXISTED,
      )
        .withErrors({ name: MessageEnum.NAME_EXISTED })
        .toResponse();
    }

    const entity = this.categoryRepository.updateEntity(existed, request);
    await this.categoryRepository.save(entity);

    return new ResponseBuilder().build();
  }

  async delete(request: IdParamsDto): Promise<ResponsePayload<any>> {
    const existed = await this.categoryRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CATEGORY_NOT_FOUND,
      ).toResponse();
    }

    await this.categoryRepository.softDelete(request.id);
    removeFile(existed.image);

    return new ResponseBuilder().build();
  }
}
