import { HashProvider } from "@/shared/application/providers/hash-provider";
import { SignupUseCase } from "../../signup.usecase";
import { BcryptjsHashProvider } from "@/modules/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserInMemoryRepository } from "@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository";
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder";
import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { BadRequestError } from "../../../../../../shared/application/errors/bad-request-error";


describe('SigninUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase;
  let userRepository : UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignupUseCase.UseCase(userRepository,hashProvider);
  });

  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(userRepository,'insert');
    const props = userDataBuilder({});
    const result = await sut.execute(props)

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1)
  });

  it('Should not be able to register with same email twice', async () => {
    const props = userDataBuilder({email:'a@a.com'});
    await sut.execute(props)

    await expect(()=> sut.execute(props)).rejects.toBeInstanceOf(ConflictError)

  });

  it('Should throws error when name not provided', async () => {
    const props = Object.assign(userDataBuilder({}),{name:null})
    await expect(()=> sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });

  it('Should throws error when email not provided', async () => {
    const props = Object.assign(userDataBuilder({}),{email:null})
    await expect(()=> sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });

  it('Should throws error when password not provided', async () => {
    const props = Object.assign(userDataBuilder({}),{password:null})
    await expect(()=> sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });
});
