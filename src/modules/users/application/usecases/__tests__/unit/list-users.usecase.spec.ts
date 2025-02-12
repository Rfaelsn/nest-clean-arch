import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { UserRepository } from "@/modules/users/domain/repositories/user.repository";
import { ListUsersUseCase } from "../../list-users.usecase";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";


describe('ListUsersUseCase unit tests',()=>{
  let sut: ListUsersUseCase.UseCase;
  let userRepository : UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(userRepository);
  });

  it('toOutput method',()=>{
    let result = new UserRepository.SearchResult({
      items: [],
      total:1,
      currentPage:1,
      perPage:2,
      sort:null,
      sortDir:null,
      filter:null
    });

    let output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items:[],
      total:1,
      currentPage:1,
      lastPage:1,
      perPage:2
    })

    const userEntity = new UserEntity(userDataBuilder({}));

    result = new UserRepository.SearchResult({
      items: [userEntity],
      total:1,
      currentPage:1,
      perPage:2,
      sort:null,
      sortDir:null,
      filter:null
    });

    output = sut['toOutput'](result)
    expect(output).toStrictEqual({
      items:[userEntity.toJSON()],
      total:1,
      currentPage:1,
      lastPage:1,
      perPage:2
    })
  })
})
