import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { TableRepository } from '@src/repositories/table.repository';
import { FloorRepository } from '@src/repositories/floor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Table])],
  controllers: [TableController],
  providers: [
    {
      provide: 'ITableService',
      useClass: TableService,
    },
    {
      provide: 'ITableRepository',
      useClass: TableRepository,
    },
    {
      provide: 'IFloorRepository',
      useClass: FloorRepository,
    },
  ],
  exports: [
    {
      provide: 'ITableRepository',
      useClass: TableRepository,
    },
  ],
})
export class TableModule {}
