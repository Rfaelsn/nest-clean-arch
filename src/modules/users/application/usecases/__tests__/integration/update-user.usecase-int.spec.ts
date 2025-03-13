import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/modules/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';
import { UpdateUserUseCase } from '../../update-user.usecase';

describe('UpdateUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    //encerra o modulo apos rodar esta switch de testes
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', name: 'fake name' }),
    ).rejects.toThrow(new NotFoundError('UserModel not found using id fakeId'));
  });

  it('should throws error when name not provided', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(() => sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new NotFoundError('UserModel not found using id fakeId'),
    );
  });

  it('should update a user', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    const outputUser = await sut.execute({ id: entity._id, name: 'new Name' });

    expect(outputUser.name).toBe('new Name');
  });
});
