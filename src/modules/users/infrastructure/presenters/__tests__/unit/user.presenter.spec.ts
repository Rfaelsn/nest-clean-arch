import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter', () => {
  const createdAt = new Date();
  const props = {
    id: 'a1442255-e2b0-47d0-ae53-57c0d0d2ba0b',
    name: 'Jhon Doe',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'a1442255-e2b0-47d0-ae53-57c0d0d2ba0b',
        name: 'Jhon Doe',
        email: 'a@a.com',
        createdAt: createdAt.toISOString(),
      });
    });
  });
});
