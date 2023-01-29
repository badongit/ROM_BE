import { UpdateCategoryBodyDto } from '@src/components/category/dto/request/update-category.body.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CreateCustomerBodyDto } from '../dto/request/create-customer.body.dto';
import { ListCustomerQueryDto } from '../dto/request/list-customer.query.dto';
import { UpdateCustomerBodyDto } from '../dto/request/update-customer.body.dto';
import { CustomerResponseDto } from '../dto/response/customer.response.dto';
import { DetailCustomerResponseDto } from '../dto/response/detail-customer.response.dto';

export interface ICustomerService {
  create(request: CreateCustomerBodyDto): Promise<ResponsePayload<any>>;
  update(
    request: IdParamsDto & UpdateCustomerBodyDto,
  ): Promise<ResponsePayload<any>>;
  list(
    request: ListCustomerQueryDto,
  ): Promise<ResponsePayload<CustomerResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailCustomerResponseDto | any>>;
}
