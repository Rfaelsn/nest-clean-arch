import { SearchInput } from '@/shared/application/dtos/search-input';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutputDto } from '../dtos/user-output.dto';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { PaginationOutput, PaginationOutputMapper } from '@/shared/application/dtos/pagination-output';

// eslint-disable-next-line
export namespace ListUsersUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<UserOutputDto>;

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private readonly userRepository: UserRepository.Repository
    ) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult:UserRepository.SearchResult):Output{
      const items = searchResult.items.map(item=> item.toJSON());
      return PaginationOutputMapper.toOutput(items,searchResult);
    }
  }
}
