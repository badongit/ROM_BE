import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  RemoveOptions,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<Entity extends ObjectLiteral> {
  findById(id: number | string): Promise<Entity | null>;

  findOne(options?: FindOneOptions<Entity>): Promise<Entity | null>;

  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;

  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;

  save(entity: Entity, options?: SaveOptions): Promise<Entity>;

  saveMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;

  update(
    criteria: string | string[] | number | number[] | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult>;

  delete(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult>;

  softDelete(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult>;

  restore(
    criteria: number | number[] | FindOptionsWhere<Entity>,
  ): Promise<UpdateResult>;

  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;

  removeMany(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;

  softRemove(entity: Entity, options?: SaveOptions): Promise<Entity>;

  softRemoveMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;

  recover(entity: Entity, options?: SaveOptions): Promise<Entity>;

  recoverMany(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
}
