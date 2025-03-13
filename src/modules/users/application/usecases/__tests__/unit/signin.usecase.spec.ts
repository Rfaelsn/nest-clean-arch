import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/modules/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserInMemoryRepository } from '@/modules/users/infrastructure/database/in-memory/repositorys/user-in-memory.repository';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';
import { BadRequestError } from '../../../../../../shared/application/errors/bad-request-error';
import { SigninUseCase } from '../../signin.usecase';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

describe('SigninUseCase unit tests', () => {
  let sut: SigninUseCase.UseCase;
  let userRepository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(userRepository, hashProvider);
  });

  it('Should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('1234');
    const userEntity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    userRepository.items = [userEntity];
    const result = await sut.execute({
      email: userEntity.email,
      password: '1234',
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(userEntity.toJSON());
  });

  it('Should throws error when email not provided', async () => {
    const props = { email: null, password: '1234' };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when password not provided', async () => {
    const props = { email: 'a@a.com', password: null };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should not able to authenticate with wrong email', async () => {
    const props = { email: 'a@a.com', password: '1234' };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('Should not able to authenticate with wrong password', async () => {
    const userEntity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: '1234' }),
    );
    userRepository.items = [userEntity];
    const props = { email: 'a@a.com', password: 'fake' };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
