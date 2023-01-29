import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerRepository } from '@src/repositories/customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'ICustomerService',
      useClass: CustomerService,
    },
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
})
export class CustomerModule {}
