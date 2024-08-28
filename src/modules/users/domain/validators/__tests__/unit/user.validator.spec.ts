import { userDataBuilder } from '../../../testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator';

let sut: UserValidator;

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });

  it('validate case for user validator class', () => {
    const props = userDataBuilder({});
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
  });

  describe('name field tests', () => {
    describe('Invalidation cases', () => {
      it('Invalidation cases for name field', () => {
        const isValid = sut.validate(null);
        expect(isValid).toBeFalsy();
        expect(sut.errors['name']).toStrictEqual([
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ]);
      });

      it('should return error if name is empty', () => {
        const isValid = sut.validate({ ...userDataBuilder({}), name: '' });
        expect(isValid).toBeFalsy();
        expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
      });

      it('should return error if name is a number', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          name: 255 as any,
        });

        expect(isValid).toBeFalsy();

        expect(sut.errors['name']).toStrictEqual([
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ]);
      });

      it('should validate return false if name is hight 255 characters', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          name: 'a'.repeat(256),
        });
        expect(isValid).toBeFalsy();
        expect(sut.errors['name']).toStrictEqual([
          'name must be shorter than or equal to 255 characters',
        ]);
      });
    });
  });

  describe('email field tests', () => {
    describe('Invalidation cases', () => {
      it('Invalidation cases for email field', () => {
        const isValid = sut.validate(null);
        expect(isValid).toBeFalsy();
        expect(sut.errors['email']).toStrictEqual([
          'email should not be empty',
          'email must be an email',
          'email must be a string',
          'email must be shorter than or equal to 255 characters',
        ]);
      });

      it('should return error if email is empty', () => {
        const isValid = sut.validate({ ...userDataBuilder({}), email: '' });
        expect(isValid).toBeFalsy();
        expect(sut.errors['email']).toStrictEqual([
          'email should not be empty',
          'email must be an email',
        ]);
      });

      it('should return error if email is a number', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          email: 255 as any,
        });

        expect(isValid).toBeFalsy();

        expect(sut.errors['email']).toStrictEqual([
          'email must be an email',
          'email must be a string',
          'email must be shorter than or equal to 255 characters',
        ]);
      });

      it('should validate return false if name is hight 255 characters', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          email: 'a'.repeat(256),
        });
        expect(isValid).toBeFalsy();
        expect(sut.errors['email']).toStrictEqual([
          'email must be an email',
          'email must be shorter than or equal to 255 characters',
        ]);
      });
    });
  });

  describe('password field tests', () => {
    describe('Invalidation cases', () => {
      it('Invalidation cases for password field', () => {
        const isValid = sut.validate(null);
        expect(isValid).toBeFalsy();
        expect(sut.errors['password']).toStrictEqual([
          'password should not be empty',
          'password must be a string',
          'password must be shorter than or equal to 100 characters',
        ]);
      });

      it('should return error if password is empty', () => {
        const isValid = sut.validate({ ...userDataBuilder({}), password: '' });
        expect(isValid).toBeFalsy();
        expect(sut.errors['password']).toStrictEqual([
          'password should not be empty',
        ]);
      });

      it('should return error if password is a number', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          password: 255 as any,
        });

        expect(isValid).toBeFalsy();

        expect(sut.errors['password']).toStrictEqual([
          'password must be a string',
          'password must be shorter than or equal to 100 characters',
        ]);
      });

      it('should validate return false if password is hight 100 characters', () => {
        const isValid = sut.validate({
          ...userDataBuilder({}),
          password: 'a'.repeat(256),
        });
        expect(isValid).toBeFalsy();
        expect(sut.errors['password']).toStrictEqual([
          'password must be shorter than or equal to 100 characters',
        ]);
      });
    });
  });
});
