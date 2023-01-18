import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  RemoveOptions,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { IBaseRepository } from './base.repository.interface';

export class BaseRepository<Entity extends ObjectLiteral>
  implements IBaseRepository<Entity>
{
  private repository: Repository<Entity>;

  protected constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOne(options);
  }

  find(options: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  save(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.save(entity, options);
  }

  saveMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]> {
    return this.repository.save(entities, options);
  }

  delete(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }
  softDelete(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }
  restore(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.restore(criteria);
  }

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity> {
    return this.repository.remove(entity, options);
  }

  removeMany(entity: Entity[], options?: RemoveOptions): Promise<Entity[]> {
    return this.repository.remove(entity, options);
  }

  softRemove(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.softRemove(entity, options);
  }

  softRemoveMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]> {
    return this.repository.softRemove(entities, options);
  }

  recover(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.recover(entity, options);
  }

  recoverMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]> {
    return this.repository.recover(entities, options);
  }
}
