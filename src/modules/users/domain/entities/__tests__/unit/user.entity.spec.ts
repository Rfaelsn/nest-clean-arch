import { UserEntity, UserProps } from '../../user.entity';
import { userDataBuilder } from '../../../testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  let sut: UserEntity;
  let props: UserProps;

  beforeEach(() => {
    UserEntity.validate = jest.fn(); //mocando a implementação do metodo estatico
    props = userDataBuilder({});
    sut = new UserEntity({ ...props });
  });

  it('should create a new UserEntity', () => {
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should return the name when the getter is called', () => {
    expect(sut.props.name).toBeDefined();
    expect(sut.props.name).toEqual(props.name);
    expect(typeof sut.props.name).toBe('string');
  });

  it('should set the name when the setter is called', () => {
    sut['name'] = 'test';
    expect(sut.props.name).toEqual('test');
    expect(typeof sut.props.name).toBe('string');
  });

  it('should return the email when the getter is called', () => {
    expect(sut.props.email).toBeDefined();
    expect(sut.props.email).toEqual(props.email);
    expect(typeof sut.props.email).toBe('string');
  });

  it('should return the password when the getter is called', () => {
    expect(sut.props.password).toBeDefined();
    expect(sut.props.password).toEqual(props.password);
    expect(typeof sut.props.password).toBe('string');
  });

  it('should set the password when the setter is called', () => {
    sut['password'] = 'test';
    expect(sut.props.password).toEqual('test');
    expect(typeof sut.props.password).toBe('string');
  });

  it('should return the createdAt when the getter is called', () => {
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should update a user', () => {
    sut.update('teste');
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual('teste');
  });

  it('should update a password', () => {
    sut.updatePassword('teste');
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.password).toEqual('teste');
  });
});
