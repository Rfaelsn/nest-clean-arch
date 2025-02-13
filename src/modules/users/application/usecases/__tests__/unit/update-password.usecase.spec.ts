import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { UpdatePasswordUseCase } from "../../update-password-user.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/modules/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error";


describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let userRepository : UserInMemoryRepository;
  let hashProvider: HashProvider

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(userRepository,hashProvider);
  });

  it('Should throws error when entity not found', async () => {
    await expect(()=>
      sut.execute({
        id:'fakeId',
        password:'test password',
        oldPassword:'test old password'
      })
    ).rejects.toThrow(
      new NotFoundError('Entity not found')
    )
  });

  it('Should throws error when old password not provided', async () => {
    const userEntity = new UserEntity(userDataBuilder({}));
    userRepository.items= [userEntity];
    await expect(()=>
      sut.execute({
        id:userEntity.id,
        password:'test password',
        oldPassword:''
      })
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required')
    )
  });

  it('Should throws error when password not provided', async () => {
    const userEntity = new UserEntity(userDataBuilder({}));
    userRepository.items= [userEntity];
    await expect(()=>
      sut.execute({
        id:userEntity.id,
        password:'',
        oldPassword:'test'
      })
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required')
    )
  });

  it('Should throws error when old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const userEntity = new UserEntity(userDataBuilder({password:hashPassword}));
    userRepository.items= [userEntity];
    await expect(()=>
      sut.execute({
        id:userEntity.id,
        password:'4567',
        oldPassword:'123456'
      })
    ).rejects.toThrow(
      new InvalidPasswordError('Old password does not match')
    )
  });

  it('Should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyUpdate = jest.spyOn(userRepository,'update');
    const items = [new UserEntity(userDataBuilder({password:hashPassword}))]
    userRepository.items = items;

    const result = await sut.execute({
      id:items[0].id,
      password:'4567',
      oldPassword:'1234'
    });

    const checkNewPassword = await hashProvider.compareHash('4567',result.password);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy()
  });
});
