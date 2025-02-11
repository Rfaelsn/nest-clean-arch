import { UserRepository } from '../../domain/repositories/user.repository';

// eslint-disable-next-line
export namespace GetUserUseCase {
  export type Input = {
    id:string
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
      private readonly userRepository: UserRepository.Repository
    ) {}

    async execute(input: Input): Promise<Output> {
      const userEntity = await this.userRepository.findById(input.id);
      return userEntity.toJSON();
    }
  }
}
