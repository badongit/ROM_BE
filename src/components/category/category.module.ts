import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from '@src/repositories/category.repository';
import { MulterModule } from '@nestjs/platform-express';
import { multerDiskStorage } from '@src/utils/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    MulterModule.register({
      storage: multerDiskStorage,
    }),
  ],
  controllers: [CategoryController],
  providers: [
    { provide: 'ICategoryService', useClass: CategoryService },
    { provide: 'ICategoryRepository', useClass: CategoryRepository },
  ],
  exports: [{ provide: 'ICategoryRepository', useClass: CategoryRepository }],
})
export class CategoryModule {}
