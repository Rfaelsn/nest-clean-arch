import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { NotFoundError } from '@/shared/application/errors/bad-request-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserModelMapper } from '../models/user-model.mapper';

export class UserPrismaRepository implements UserRepository.Repository {
  constructor(private readonly prismaService: PrismaService) {}

  sortableFields: string[];

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    throw new Error('Method not implemented.');
  }
  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJSON() });
  }
  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }
  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using id ${id}`);
    }
  }
}
