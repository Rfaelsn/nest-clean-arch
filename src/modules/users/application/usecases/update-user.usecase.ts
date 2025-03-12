import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

// eslint-disable-next-line
export namespace UpdateUserUseCase {
  export type Input = {
    id: string;
    name: string;
  };

  export type Output = UserOutputDto;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided');
      }
      const userEntity = await this.userRepository.findById(input.id);
      userEntity.update(input.name);
      await this.userRepository.update(userEntity);
      return UserOutputMapper.toOutput(userEntity);
    }
  }
}
