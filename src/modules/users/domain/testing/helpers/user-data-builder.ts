import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

export function userDataBuilder(userProps: Partial<UserProps>): UserProps {
  return {
    name: userProps.name ?? faker.person.fullName(),
    email: userProps.email ?? faker.internet.email(),
    password: userProps.password ?? faker.internet.password(),
    createdAt: userProps.createdAt ?? new Date(),
  };
}
