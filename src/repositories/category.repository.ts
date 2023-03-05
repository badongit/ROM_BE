import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryBodyDto } from '@src/components/category/dto/request/create-category.body.dto';
import { ListCategoryQueryDto } from '@src/components/category/dto/request/list-category.query.dto';
import { UpdateCategoryBodyDto } from '@src/components/category/dto/request/update-category.body.dto';
import { Category } from '@src/components/category/entities/category.entity';
import { ICategoryRepository } from '@src/components/category/interfaces/category.repository.interface';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { isEmpty } from 'class-validator';
import { ILike, Repository } from 'typeorm';

export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  createEntity(request: CreateCategoryBodyDto): Category {
    const entity = new Category();
    entity.name = request.name;
    entity.active = true;
    entity.description = request.description;

    return entity;
  }

  updateEntity(entity: Category, request: UpdateCategoryBodyDto): Category {
    const { name, active, description } = request;

    entity.name = name;
    entity.active = active;
    entity.description = description;

    return entity;
  }

  list(request: ListCategoryQueryDto): Promise<[Category[], number]> {
    const { sort, take, skip } = request;
    const sortObj: any = {};
    const conditions: any = {};

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'active':
          case 'createdAt':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    if (!isEmpty(request.keyword)) {
      conditions.name = ILike(`%${request.keyword}%`);
    }

    return this.categoryRepository.findAndCount({
      where: conditions,
      order: sortObj,
      take: take,
      skip: skip,
    });
  }
}
