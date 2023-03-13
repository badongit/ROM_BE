import { InjectRepository } from '@nestjs/typeorm';
import { DishStatusEnum } from '@src/components/dish/constants/status.enum';
import { CreateDishBodyDto } from '@src/components/dish/dto/request/creat-dish.body.dto';
import { ListDishQueryDto } from '@src/components/dish/dto/request/list-dish.query.dto';
import { UpdateDishBodyDto } from '@src/components/dish/dto/request/update-dish.body.dto';
import { Dish } from '@src/components/dish/entities/dish.entity';
import { IDishRepository } from '@src/components/dish/interfaces/dish.repository.interface';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { isDefined, isEmpty } from 'class-validator';
import { Repository } from 'typeorm';

export class DishRepository
  extends BaseRepository<Dish>
  implements IDishRepository
{
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {
    super(dishRepository);
  }

  createEntity(request: CreateDishBodyDto): Dish {
    const { name, price, description, categoryId, image } = request;
    const entity = new Dish();
    entity.name = name;
    entity.price = price;
    entity.status = DishStatusEnum.READY;
    entity.image = image.filename;
    entity.description = description;
    entity.categoryId = categoryId;

    return entity;
  }

  updateEntity(entity: Dish, request: UpdateDishBodyDto): Dish {
    const { name, price, status, description, categoryId, image } = request;
    entity.name = name;
    entity.price = price;
    entity.status = status;
    entity.description = description;
    entity.categoryId = categoryId;
    entity.image = image.filename;

    return entity;
  }

  list(request: ListDishQueryDto): Promise<[Dish[], number]> {
    const { sort, take, skip, categoryId, status } = request;
    const sortObj: any = {};
    const conditions: any = {};

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'status':
          case 'price':
          case 'categoryId':
          case 'createdAt':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    if (categoryId) {
      conditions.categoryId = categoryId;
    }

    if (isDefined(status)) {
      conditions.status = status;
    }

    return this.dishRepository.findAndCount({
      where: conditions,
      order: sortObj,
      take: take,
      skip: skip,
    });
  }
}
