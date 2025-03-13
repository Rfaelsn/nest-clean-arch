import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '@/modules/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { DeleteUserUseCase } from '../../delete-user.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';

describe('DeleteUserUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase.UseCase;
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
    sut = new DeleteUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    //encerra o modulo apos rodar esta switch de testes
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('UserModel not found using id fakeId'),
    );
  });

  it('should delete a entity', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    await sut.execute({ id: entity._id });

    const outputUser = await prismaService.user.findUnique({
      where: { id: entity._id },
    });

    expect(outputUser).toBeNull();
    const models = await prismaService.user.findMany();
    expect(models).toHaveLength(0);
  });
});
