import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line
export namespace GetUserUseCase {
  export type Input = {
    id:string
  };

  export type Output = UserOutputDto;

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository
    ) {}

    async execute(input: Input): Promise<Output> {
      const userEntity = await this.userRepository.findById(input.id);
      return userEntity.toJSON();
    }
  }
}
