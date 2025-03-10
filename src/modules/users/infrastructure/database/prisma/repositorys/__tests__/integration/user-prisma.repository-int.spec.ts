import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/application/errors/bad-request-error';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throws error when entity not found', async () => {
    expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using id FakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });
    const outputUser = await sut.findById(newUser.id);
    expect(outputUser.toJSON()).toStrictEqual(entity.toJSON());
  });
});
