import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { Equal, Not } from 'typeorm';
import { IFloorRepository } from '../floor/interfaces/floor.repository.interface';
import { TableStatusEnum } from './constants/status.enum';
import { ChangeStatusTableBodyDto } from './dto/request/change-status-table.body.dto';
import { CreateTableBodyDto } from './dto/request/create-table.body.dto';
import { ListTableQueryDto } from './dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from './dto/request/update-table.body.dto';
import { DetailTableResponseDto } from './dto/response/detail-table.response.dto';
import { TableResponseDto } from './dto/response/table.response.dto';
import { ITableRepository } from './interfaces/table.repository.interface';
import { ITableService } from './interfaces/table.service.interface';

@Injectable()
export class TableService implements ITableService {
  constructor(
    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,

    @Inject('IFloorRepository')
    private readonly floorRepository: IFloorRepository,
  ) {}

  async create(request: CreateTableBodyDto): Promise<ResponsePayload<any>> {
    const responseError = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const table = this.tableRepository.createEntity(request);
    await this.tableRepository.save(table);

    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async list(
    request: ListTableQueryDto,
  ): Promise<ResponsePayload<TableResponseDto>> {
    const [tables, count] = await this.tableRepository.list(request);

    const dataReturn = plainToClass(TableResponseDto, tables, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailTableResponseDto | any>> {
    const table = await this.tableRepository.findById(request.id);

    if (!table) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.TABLE_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailTableResponseDto, table, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async update(
    request: IdParamsDto & UpdateTableBodyDto,
  ): Promise<ResponsePayload<any>> {
    const responseError = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const existed = await this.tableRepository.findById(request.id);
    const entity = this.tableRepository.updateEntity(existed, request);
    await this.tableRepository.save(entity);

    return new ResponseBuilder().build();
  }

  async changeStatus(
    request: IdParamsDto & ChangeStatusTableBodyDto,
  ): Promise<ResponsePayload<any>> {
    const existed = await this.tableRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.TABLE_NOT_FOUND,
      ).toResponse();
    }

    const responseError = this.validateChangeStatus(
      existed.status,
      request.status,
    );

    if (responseError) {
      return responseError;
    }

    existed.status = request.status;
    await this.tableRepository.save(existed);

    return new ResponseBuilder().build();
  }

  async delete(request: IdParamsDto): Promise<ResponsePayload<any>> {
    const existed = await this.tableRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.TABLE_NOT_FOUND,
      ).toResponse();
    }

    await this.tableRepository.softDelete(request.id);
    return new ResponseBuilder().build();
  }

  async validateBeforeSave(request: any): Promise<ResponsePayload<any> | null> {
    const { id, code, floorId } = request;

    const existedCodeConditions: any = {};

    if (id) {
      const existed = await this.tableRepository.findById(id);

      if (!existed) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          MessageEnum.TABLE_NOT_FOUND,
        ).toResponse();
      }

      existedCodeConditions.id = Not(Equal(id));
    }

    if (floorId) {
      const floorExisted = await this.floorRepository.findById(floorId);

      if (!floorExisted) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          MessageEnum.FLOOR_NOT_FOUND,
        ).toResponse();
      }
    }

    if (code) {
      existedCodeConditions.code = code;
      const existedCode = await this.tableRepository.findOne({
        where: existedCodeConditions,
        withDeleted: true,
      });

      if (existedCode) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          MessageEnum.CODE_EXISTED,
        )
          .withErrors({ code: MessageEnum.CODE_EXISTED })
          .toResponse();
      }
    }

    return null;
  }

  validateChangeStatus(
    oldStatus: TableStatusEnum,
    newStatus: TableStatusEnum,
  ): ResponsePayload<any> | null {
    let isValid = true;
    switch (newStatus) {
      case TableStatusEnum.RESERVED:
      case TableStatusEnum.OFF:
        if (oldStatus !== TableStatusEnum.EMPTY) isValid = false;
        break;
      case TableStatusEnum.SERVING:
        if (
          oldStatus !== TableStatusEnum.EMPTY &&
          oldStatus !== TableStatusEnum.RESERVED
        )
          isValid = false;
        break;
    }

    if (isValid) return null;

    return new ApiError(
      ResponseCodeEnum.BAD_REQUEST,
      MessageEnum.STATUS_INVALID,
    ).toResponse();
  }
}
