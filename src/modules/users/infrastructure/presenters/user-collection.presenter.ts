import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { UserPresenter } from './user.presenter';
import { ListUsersUseCase } from '../../application/usecases/list-users.usecase';

export class UserCollectionPresenter extends CollectionPresenter {
  // a criacao da propriedade atende a necessidade do get da classe abstrata
  data: UserPresenter[];
  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new UserPresenter(item));
  }
}
