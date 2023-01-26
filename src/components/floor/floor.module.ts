import { Module } from '@nestjs/common';
import { FloorService } from './floor.service';
import { FloorController } from './floor.controller';
import { FloorRepository } from 'src/repositories/floor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Floor])],
  controllers: [FloorController],
  providers: [
    {
      provide: 'IFloorRepository',
      useClass: FloorRepository,
    },
    {
      provide: 'IFloorService',
      useClass: FloorService,
    },
  ],
  exports: [
    {
      provide: 'IFloorRepository',
      useClass: FloorRepository,
    },
  ],
})
export class FloorModule {}
