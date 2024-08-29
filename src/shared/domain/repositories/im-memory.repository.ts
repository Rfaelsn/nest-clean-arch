import { Entity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found-error';
import { RepositoryInterface } from './repository-contract';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  private entities: E[] = [];
  async insert(entity: E): Promise<void> {
    this.entities.push(entity);
  }
  async findById(id: string): Promise<E> {
    return this._get(id);
  }
  async findAll(): Promise<E[]> {
    return this.entities;
  }
  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.entities.findIndex((item) => item.id === entity.id);
    this.entities[index] = entity;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.entities.findIndex((item) => item.id === id);
    this.entities.splice(index, 1);
  }

  protected async _get(id: string): Promise<E> {
    const _id = id;
    const entity = this.entities.find((entity) => entity.id === _id);
    if (!entity) {
      throw new NotFoundError(`Entity not found.`);
    }
    return entity;
  }
}
