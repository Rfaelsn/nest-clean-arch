import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto, UserOutputMapper } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';

// eslint-disable-next-line
export namespace UpdatePasswordUseCase {
  export type Input = {
    id:string,
    password:string,
    oldPassword:string
  };

  export type Output = UserOutputDto;

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly hashProvider:HashProvider
    ) {}

    async execute(input: Input): Promise<Output> {
      const userEntity = await this.userRepository.findById(input.id);
      if(!input.password || !input.oldPassword){
        throw new InvalidPasswordError('Old password and new password is required');
      }
      const checkOldPassword = await this.hashProvider.compareHash(input.oldPassword,userEntity.password);
      if(!checkOldPassword){
        throw new InvalidPasswordError('Old password does not match');
      }
      const hashPassword = await this.hashProvider.generateHash(input.password);
      userEntity.updatePassword(hashPassword);
      await this.userRepository.update(userEntity);
      return UserOutputMapper.toOutput(userEntity);
    }
  }
}
