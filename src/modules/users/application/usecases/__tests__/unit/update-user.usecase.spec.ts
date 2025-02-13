import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { UpdateUserUseCase } from "../../update-user.usecase";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";


describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let userRepository : UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(userRepository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(()=> sut.execute({id:'fakeId',name:'test name'}) ).rejects.toThrow(
      new NotFoundError('Entity not found')
    )
  });

  it('Should throws error when name not provided', async () => {
    await expect(()=> sut.execute({id:'fakeId',name:''}) ).rejects.toThrow(
      new BadRequestError('Name not provided')
    )
  });

  it('Should update a user', async () => {
    const spyUpdate = jest.spyOn(userRepository,'update');
    const items = [new UserEntity(userDataBuilder({}))]
    userRepository.items = items;

    const result = await sut.execute({id:items[0].id,name:'new name'});
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id:items[0].id,
      name:'new name',
      email:items[0].email,
      password:items[0].password,
      createdAt:items[0].createdAt,
    })
  });
});
