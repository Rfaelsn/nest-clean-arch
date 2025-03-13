import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserPrismaRepository } from '@/modules/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/modules/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';
import { SigninUseCase } from '../../signin.usecase';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await expect(() =>
      sut.execute({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fake',
      }),
    ).rejects.toThrow(new InvalidCredentialsError('Invalid credentials'));
  });

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      userDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const userOutput = await sut.execute({
      email: 'a@a.com',
      password: '1234',
    });

    expect(userOutput).toMatchObject(entity.toJSON());
  });
});
