import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { UpdateCategoryBodyDto } from '../category/dto/request/update-category.body.dto';
import { CreateCustomerBodyDto } from './dto/request/create-customer.body.dto';
import { ListCustomerQueryDto } from './dto/request/list-customer.query.dto';
import { UpdateCustomerBodyDto } from './dto/request/update-customer.body.dto';
import { CustomerResponseDto } from './dto/response/customer.response.dto';
import { DetailCustomerResponseDto } from './dto/response/detail-customer.response.dto';
import { ICustomerRepository } from './interfaces/customer.repository.interface';
import { ICustomerService } from './interfaces/customer.service.interface';

@Injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async create(request: CreateCustomerBodyDto): Promise<ResponsePayload<any>> {
    const existed = await this.customerRepository.findOne({
      where: { phoneNumber: request.phoneNumber },
    });

    if (existed) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.PHONE_NUMBER_EXISTED,
      )
        .withErrors({ phoneNumber: MessageEnum.PHONE_NUMBER_EXISTED })
        .toResponse();
    }

    const entity = this.customerRepository.createEntity(request);
    await this.customerRepository.save(entity);
    return new ResponseBuilder().withCode(ResponseCodeEnum.CREATED).build();
  }

  async update(
    request: IdParamsDto & UpdateCustomerBodyDto,
  ): Promise<ResponsePayload<any>> {
    const existed = await this.customerRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CUSTOMER_NOT_FOUND,
      ).toResponse();
    }

    if (request.phoneNumber) {
      const existedPhone = await this.customerRepository.findOne({
        where: { phoneNumber: request.phoneNumber },
      });

      if (existedPhone) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          MessageEnum.PHONE_NUMBER_EXISTED,
        )
          .withErrors({ phoneNumber: MessageEnum.PHONE_NUMBER_EXISTED })
          .toResponse();
      }
    }

    const entity = this.customerRepository.updateEntity(existed, request);
    await this.customerRepository.save(entity);
    return new ResponseBuilder().build();
  }

  async list(
    request: ListCustomerQueryDto,
  ): Promise<ResponsePayload<CustomerResponseDto>> {
    const [customers, count] = await this.customerRepository.list(request);

    const dataReturn = plainToClass(CustomerResponseDto, customers, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailCustomerResponseDto | any>> {
    const existed = await this.customerRepository.findById(request.id);

    if (!existed) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.CUSTOMER_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailCustomerResponseDto, existed, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }
}
