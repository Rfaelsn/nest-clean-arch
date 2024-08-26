import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let sut: UserEntity;
  let props: UserProps;

  beforeEach(() => {
    props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    sut = new UserEntity({ ...props });
  });

  it('should create a new UserEntity', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });
});
