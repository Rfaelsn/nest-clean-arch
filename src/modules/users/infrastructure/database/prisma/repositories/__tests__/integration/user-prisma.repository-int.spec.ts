import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/application/errors/bad-request-error';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

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
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using id FakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    const newUser = await prismaService.user.create({ data: entity.toJSON() });
    const outputUser = await sut.findById(newUser.id);
    expect(outputUser.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new entity', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await sut.insert(entity);
    const result = await prismaService.user.findUnique({
      where: { id: entity._id },
    });
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('should return all users', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });
    const userEntities = await sut.findAll();
    expect(userEntities).toHaveLength(1);

    //outra forma de fazer
    expect(JSON.stringify(userEntities)).toBe(JSON.stringify([entity]));

    userEntities.map((item) =>
      expect(item.toJSON()).toStrictEqual(entity.toJSON()),
    );
  });

  it('should throws error on update when entity not found', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using id ${entity._id}`),
    );
  });

  it('should update a entity', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    entity.update('new name');

    await sut.update(entity);

    const outputUser = await prismaService.user.findUnique({
      where: { id: entity._id },
    });

    expect(outputUser.name).toBe('new name');
  });

  it('should throws error on delete when entity not found', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using id ${entity._id}`),
    );
  });

  it('should delete a entity', async () => {
    const entity = new UserEntity(userDataBuilder({}));
    await prismaService.user.create({ data: entity.toJSON() });

    await sut.delete(entity._id);

    const outputUser = await prismaService.user.findUnique({
      where: { id: entity._id },
    });

    expect(outputUser).toBeNull();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError(`UserModel not found using email a@a.com`),
    );
  });

  it('should finds a entity by email', async () => {
    const entity = new UserEntity(userDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({ data: entity.toJSON() });

    const outputUser = await sut.findByEmail('a@a.com');

    expect(outputUser.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throws error when entity found by email', async () => {
    const entity = new UserEntity(userDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({ data: entity.toJSON() });
    await expect(() => sut.emailExists('a@a.com')).rejects.toThrow(
      new ConflictError(`Email address already used`),
    );
  });

  it('should not finds a entity by email', async () => {
    expect.assertions(0);
    await sut.emailExists('a@a.com');
  });

  describe('search method tests', () => {
    it('should return all users', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];

      const arrange = Array(16).fill(userDataBuilder({}));

      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...item,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(UserEntity);
      });

      //reverse é feito pq o padrão de items é decrescente e precisamos iterar na mesma ordem para o expect
      //somamos mais 1 no teste pois como o search result vai trazer 15 o indice 0 fica para a segunda page ja que é decrescente
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toBe(item.email);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...userDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });
});
