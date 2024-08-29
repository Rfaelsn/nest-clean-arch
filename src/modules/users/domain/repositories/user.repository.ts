import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository extends InMemoryRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>;
  emailExists(email: string): Promise<void>;
}
