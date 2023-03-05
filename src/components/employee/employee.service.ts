import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { Equal, Not } from 'typeorm';
import { EmployeeStatusEnum } from './constants/status.enum';
import { ChangeStatusEmployeeBodyDto } from './dto/request/change-employee.body.dto';
import { CreateEmployeeBodyDto } from './dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from './dto/request/list-employee.query.dto';
import { UpdateEmployeeByAdminBodyDto } from './dto/request/update-employee-by-admin.body.dto';
import { UpdateEmployeeByManagerBodyDto } from './dto/request/update-employee-by-manager.body.dto';
import { UpdateEmployeeBodyDto } from './dto/request/update-employee.body,dto';
import { DetailEmployeeResponseDto } from './dto/response/detail-employee.response.dto';
import { EmployeeResponseDto } from './dto/response/employee.response.dto';
import { Employee } from './entities/employee.entity';
import { IEmployeeRepository } from './interfaces/employee.repository.interface';
import { IEmployeeService } from './interfaces/employee.service.interface';

@Injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async create(request: CreateEmployeeBodyDto): Promise<ResponsePayload<any>> {
    const [responseError] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const entity = this.employeeRepository.createEntity(request);
    await this.employeeRepository.save(entity);

    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async update(
    request: IdParamsDto & UpdateEmployeeBodyDto,
  ): Promise<ResponsePayload<any>> {
    const [responseError, existed] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const entity = this.employeeRepository.updateEntity(existed, request);
    await this.employeeRepository.save(entity);
    return new ResponseBuilder().build();
  }

  async list(
    request: ListEmployeeQueryDto,
  ): Promise<ResponsePayload<EmployeeResponseDto>> {
    const [employees, count] = await this.employeeRepository.list(request);

    const dataReturn = plainToClass(EmployeeResponseDto, employees, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailEmployeeResponseDto | any>> {
    const existed = await this.employeeRepository.findOne({
      where: { id: request.id },
    });

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.EMPLOYEE_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailEmployeeResponseDto, existed, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  async delete(request: IdParamsDto): Promise<ResponsePayload<any>> {
    const existed = await this.employeeRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.EMPLOYEE_NOT_FOUND,
      ).toResponse();
    }

    await this.employeeRepository.softDelete(request.id);
    return new ResponseBuilder().build();
  }

  async changeStatus(
    request: IdParamsDto & ChangeStatusEmployeeBodyDto,
  ): Promise<ResponsePayload<any>> {
    const existed = await this.employeeRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.EMPLOYEE_NOT_FOUND,
      ).toResponse();
    }

    const responseError = this.validateChangeStatus(
      existed.status,
      request.status,
    );

    if (responseError) {
      return responseError;
    }

    const entity = this.employeeRepository.changeStatus(existed, request);
    await this.employeeRepository.save(entity);

    return new ResponseBuilder().build();
  }

  async updateByManager(
    request: IdParamsDto & UpdateEmployeeByManagerBodyDto,
  ): Promise<ResponsePayload<any>> {
    const [responseError, existed] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const entity = this.employeeRepository.updateEntityByManager(
      existed,
      request,
    );
    await this.employeeRepository.save(entity);
    return new ResponseBuilder().build();
  }

  async updateByAdmin(
    request: IdParamsDto & UpdateEmployeeByAdminBodyDto,
  ): Promise<ResponsePayload<any>> {
    const [responseError, existed] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const entity = this.employeeRepository.updateEntityByAdmin(
      existed,
      request,
    );
    await this.employeeRepository.save(entity);
    return new ResponseBuilder().build();
  }

  private async validateBeforeSave(
    request: any,
  ): Promise<[ResponsePayload<any>, Employee]> {
    let entity: Employee = null;
    let error: ApiError = new ApiError(
      ResponseCodeEnum.BAD_REQUEST,
      MessageEnum.BAD_REQUEST,
    );
    const conditions: any = {};
    if (request.id) {
      entity = await this.employeeRepository.findById(request.id);

      if (!entity) {
        return [
          new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.EMPLOYEE_NOT_FOUND,
          ).toResponse(),
          entity,
        ];
      }
      conditions.id = Not(Equal(request.id));
    }

    if (request.code) {
      const existedCode = await this.employeeRepository.findOne({
        where: { code: request.code, ...conditions },
        withDeleted: true,
      });

      if (existedCode) {
        error.withErrors({ code: MessageEnum.CODE_EXISTED });
      }
    }

    if (request.phoneNumber) {
      const existedPhone = await this.employeeRepository.findOne({
        where: { phoneNumber: request.phoneNumber, ...conditions },
        withDeleted: true,
      });

      if (existedPhone) {
        error.withErrors({ phoneNumber: MessageEnum.PHONE_NUMBER_EXISTED });
      }
    }

    return [isEmpty(error.errors) ? null : error.toResponse(), entity];
  }

  private validateChangeStatus(
    oldStatus: EmployeeStatusEnum,
    newStatus: EmployeeStatusEnum,
  ): ResponsePayload<any> {
    switch (newStatus) {
      case EmployeeStatusEnum.TEMP_LEAVE:
        if (oldStatus !== EmployeeStatusEnum.WORKING) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.STATUS_INVALID,
          ).toResponse();
        }
        break;
    }

    return null;
  }
}
