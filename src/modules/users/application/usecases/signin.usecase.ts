import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserRepository } from '../../domain/repositories/user.repository';
import { BadRequestError } from '../../../../shared/application/errors/bad-request-error';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

// eslint-disable-next-line
export namespace SigninUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutputDto;

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly hashProvider:HashProvider
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password } = input;

      if (!email || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const userEntity = await this.userRepository.findByEmail(email);

      const hashPasswordMatches = await this.hashProvider.compareHash(password,userEntity.password);

      if(!hashPasswordMatches){
        throw new InvalidCredentialsError('Invalid credentials')
      }

      return UserOutputMapper.toOutput(userEntity);
    }
  }
}
