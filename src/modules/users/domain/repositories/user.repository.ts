import { UserEntity } from '../entities/user.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract';

// eslint-disable-next-line
export namespace UserRepository {
  //redefinimos os tipos aqui na implementação da entidade para permitir a sobrescrita das propriedades
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>;
    emailExists(email: string): Promise<void>;
  }
}
