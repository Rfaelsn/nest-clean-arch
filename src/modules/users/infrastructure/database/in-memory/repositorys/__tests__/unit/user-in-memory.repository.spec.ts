import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('rafa.teste@email.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email rafa.teste@email.com'),
    );
  });

  it('Should find a entity by email - findByEmail method', async () => {
    const userEntity = new UserEntity(userDataBuilder({}));
    sut.insert(userEntity);
    const result = await sut.findByEmail(userEntity.email);
    expect(result.toJSON()).toStrictEqual(userEntity.toJSON());
  });

  //email exists
  it('Should throw error when not found - emailExists method', async () => {
    const userEntity = new UserEntity(userDataBuilder({}));
    sut.insert(userEntity);
    await expect(sut.emailExists(userEntity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    );
  });

  it('Should exec without error - emailExists method', async () => {
    expect.assertions(0);
    await sut.emailExists('rafa.teste@email.com');
  });

  //apply filter
  it('should no filter items when filter object is null', async () => {
    const entity = new UserEntity(userDataBuilder({ name: 'TEST' }));
    sut.insert(entity);
    const result = await sut.findAll();
    const spyFilter = jest.spyOn(result, 'filter');
    const itemsFiltered = await sut['applyFilter'](result, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(result);
  });

  it('should filter name field using filter param', async () => {
    const items = [
      new UserEntity(userDataBuilder({ name: 'Test' })),
      new UserEntity(userDataBuilder({ name: 'TEST' })),
      new UserEntity(userDataBuilder({ name: 'fake' })),
    ];

    const spyFilter = jest.spyOn(items, 'filter');
    const itemsFiltered = await sut['applyFilter'](items, 'TEST');
    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  //apply sort
  it('should sort by createdAt when sort param with sort and sortDir is null', async () => {
    const createdAt = new Date();
    const items = [
      new UserEntity(userDataBuilder({ name: 'Test', createdAt })),
      new UserEntity(
        userDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        userDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];

    const itemsFiltered = await sut['applySort'](items, null, null);
    expect(itemsFiltered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name field', async () => {
    const items = [
      new UserEntity(userDataBuilder({ name: 'c' })),
      new UserEntity(userDataBuilder({ name: 'd' })),
      new UserEntity(userDataBuilder({ name: 'a' })),
    ];

    let itemsFiltered = await sut['applySort'](items, 'name', 'asc');
    expect(itemsFiltered).toStrictEqual([items[2], items[0], items[1]]);

    itemsFiltered = await sut['applySort'](items, 'name', null);
    expect(itemsFiltered).toStrictEqual([items[1], items[0], items[2]]);
  });
});
