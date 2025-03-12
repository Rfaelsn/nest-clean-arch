import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BadRequestError } from '../../../../shared/application/errors/bad-request-error';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line
export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutputDto;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const userEntity = new UserEntity(
        //source do object assign injeta as propriedades em conjunto com o primeiro parametro podendo sobrescrever
        Object.assign(input, { password: hashPassword }),
      );

      await this.userRepository.insert(userEntity);

      return UserOutputMapper.toOutput(userEntity);
    }
  }
}
