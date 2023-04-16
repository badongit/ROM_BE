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
import { FindOptionsWhere, Like, Repository } from 'typeorm';

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
    const { name, phoneNumber } = request;
    const entity = new Customer();
    entity.name = name;
    entity.phoneNumber = phoneNumber;
    entity.point = 0;

    return entity;
  }
  updateEntity(entity: Customer, request: UpdateCustomerBodyDto): Customer {
    const { name, phoneNumber } = request;
    entity.name = name;
    entity.phoneNumber = phoneNumber;

    return entity;
  }
  list(
    request: ListCustomerQueryDto,
  ): Promise<[CustomerResponseDto[], number]> {
    const { sort, take, skip, phoneNumber } = request;
    const sortObj: any = {};
    const conditions: FindOptionsWhere<Customer> = {};

    if (phoneNumber) {
      conditions.phoneNumber = Like(phoneNumber);
    }

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'phoneNumber':
          case 'point':
          case 'createdAt':
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
