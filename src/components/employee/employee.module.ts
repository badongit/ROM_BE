import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeRepository } from '@src/repositories/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
    {
      provide: 'IEmployeeService',
      useClass: EmployeeService,
    },
  ],
  exports: [{ provide: 'IEmployeeRepository', useClass: EmployeeRepository }],
})
export class EmployeeModule {}
