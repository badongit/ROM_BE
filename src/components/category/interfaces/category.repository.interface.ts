import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateCategoryBodyDto } from '../dto/request/create-category.body.dto';
import { ListCategoryQueryDto } from '../dto/request/list-category.query.dto';
import { UpdateCategoryBodyDto } from '../dto/request/update-category.body.dto';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository extends BaseRepository<Category> {
  createEntity(request: CreateCategoryBodyDto): Category;
  updateEntity(entity: Category, request: UpdateCategoryBodyDto): Category;
  list(request: ListCategoryQueryDto): Promise<[Category[], number]>;
}
