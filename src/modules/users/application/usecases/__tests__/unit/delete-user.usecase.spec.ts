import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { GetUserUseCase } from "../../get-user.usecase";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { DeleteUserUseCase } from "../../delete-user.usecase";


describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase;
  let userRepository : UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new DeleteUserUseCase.UseCase(userRepository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(()=> sut.execute({id:'fakeId'}) ).rejects.toThrow(
      new NotFoundError('Entity not found')
    )
  });

  it('Should delete a user', async () => {
    const spyDelete = jest.spyOn(userRepository,'delete');
    const items = [new UserEntity(userDataBuilder({}))]
    userRepository.items = items;

    expect(userRepository.items).toHaveLength(1);
    await sut.execute({id:items[0].id});
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(userRepository.items).toHaveLength(0);
  });
});
