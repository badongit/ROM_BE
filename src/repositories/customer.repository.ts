import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerBodyDto } from '@src/components/customer/dto/request/create-customer.body.dto';
import { ListCustomerQueryDto } from '@src/components/customer/dto/request/list-customer.query.dto';
import { UpdateCustomerBodyDto } from '@src/components/customer/dto/request/update-customer.body.dto';
import { CustomerResponseDto } from '@src/components/customer/dto/response/customer.response.dto';
import { Customer } from '@src/components/customer/entities/customer.entity';
import { ICustomerRepository } from '@src/components/customer/interfaces/customer.repository.interface';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { isEmpty } from 'class-validator';
import { Repository } from 'typeorm';

export class CustomerRepository
  extends BaseRepository<Customer>
  implements ICustomerRepository
{
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super(customerRepository);
  }

  createEntity(request: CreateCustomerBodyDto): Customer {
    const { name, phone_number } = request;
    const entity = new Customer();
    entity.name = name;
    entity.phone_number = phone_number;
    entity.point = 0;

    return entity;
  }
  updateEntity(entity: Customer, request: UpdateCustomerBodyDto): Customer {
    const { name, phone_number } = request;
    entity.name = name;
    entity.phone_number = phone_number;

    return entity;
  }
  list(
    request: ListCustomerQueryDto,
  ): Promise<[CustomerResponseDto[], number]> {
    const { sort, take, skip } = request;
    const sortObj: any = {};
    const conditions: any = {};

    if (isEmpty(sort)) {
      sortObj.created_at = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'phone_number':
          case 'point':
          case 'created_at':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    return this.customerRepository.findAndCount({
      where: conditions,
      order: sortObj,
      take: take,
      skip: skip,
    });
  }
}
