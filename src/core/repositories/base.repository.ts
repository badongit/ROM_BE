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
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseRepository } from './base.repository.interface';

export class BaseRepository<Entity extends ObjectLiteral>
  implements IBaseRepository<Entity>
{
  private repository: Repository<Entity>;

  protected constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  findById(id: number | string): Promise<Entity | null> {
    return this.repository.findOneById(id);
  }

  findOne(options?: FindOneOptions<Entity>): Promise<Entity | null> {
    return this.repository.findOne(options);
  }

  find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]> {
    return this.repository.findAndCount(options);
  }

  save(entity: Entity, options?: SaveOptions): Promise<Entity> {
    return this.repository.save(entity, options);
  }

  saveMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]> {
    return this.repository.save(entities, options);
  }

  update(
    criteria: string | string[] | number | number[] | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
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
