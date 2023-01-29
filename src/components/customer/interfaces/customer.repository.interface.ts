import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateCustomerBodyDto } from '../dto/request/create-customer.body.dto';
import { ListCustomerQueryDto } from '../dto/request/list-customer.query.dto';
import { UpdateCustomerBodyDto } from '../dto/request/update-customer.body.dto';
import { CustomerResponseDto } from '../dto/response/customer.response.dto';
import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository extends BaseRepository<Customer> {
  createEntity(request: CreateCustomerBodyDto): Customer;
  updateEntity(entity: Customer, request: UpdateCustomerBodyDto): Customer;
  list(request: ListCustomerQueryDto): Promise<[CustomerResponseDto[], number]>;
}
