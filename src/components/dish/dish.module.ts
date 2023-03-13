import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '@src/repositories/category.repository';
import { DishRepository } from '@src/repositories/dish.repository';
import { multerDiskStorage } from '@src/utils/common';
import { Category } from '../category/entities/category.entity';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dish, Category]),
    MulterModule.register({
      storage: multerDiskStorage,
    }),
  ],
  controllers: [DishController],
  providers: [
    {
      provide: 'IDishRepository',
      useClass: DishRepository,
    },
    {
      provide: 'IDishService',
      useClass: DishService,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],
  exports: [
    {
      provide: 'IDishRepository',
      useClass: DishRepository,
    },
  ],
})
export class DishModule {}
