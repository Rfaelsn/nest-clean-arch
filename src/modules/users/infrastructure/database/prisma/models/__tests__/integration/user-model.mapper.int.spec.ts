import { PrismaClient, User } from '@prisma/client';
import { UserModelMapper } from '../../user-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('UserModuleMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: 'f191b851-4b72-4bef-8088-519df6f57dcf',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });
    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    });
    const sut = UserModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
