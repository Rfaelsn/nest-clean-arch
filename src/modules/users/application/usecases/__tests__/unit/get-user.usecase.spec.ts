import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { GetUserUseCase } from "../../get-user.usecase";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";


describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let userRepository : UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(userRepository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(()=> sut.execute({id:'fakeId'}) ).rejects.toThrow(
      new NotFoundError('Entity not found')
    )
  });

  it('Should be able to get user profile', async () => {
    const spyFindById = jest.spyOn(userRepository,'findById');
    const items = [new UserEntity(userDataBuilder({}))]
    userRepository.items = items;

    const result = await sut.execute({id:items[0].id});
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id:items[0].id,
      name:items[0].name,
      email:items[0].email,
      password:items[0].password,
      createdAt:items[0].createdAt,
    })
  });
});
