import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request-error';

// eslint-disable-next-line
export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  };

  export class UseCase {
    constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly hashProvider:HashProvider
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const hashPassword = this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        //source do object assign injeta as propriedades em conjunto com o primeiro parametro podendo sobrescrever
        Object.assign(
          input,
          {password: hashPassword}
        )
      );

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
