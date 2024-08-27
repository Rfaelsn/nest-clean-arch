import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('should set props and id', () => {
    //testando se as props são iguais e o id não é nulo além de ver se o validate do uuid retorna true
    const props = { prop1: 'value1', prop2: 15 };
    const entity = new StubEntity(props);
    expect(entity.props).toStrictEqual(props);
    expect(entity._id).not.toBeNull();
    expect(uuidValidate(entity._id)).toBeTruthy();
  });

  it('should accept a valid uuid', () => {
    //testando construtor ve sele ele recebe e valida um uuid passado como argumento
    const props = { prop1: 'value1', prop2: 15 };
    const id = '0c3cbc43-881d-4566-a91e-15364d2ee756';
    const entity = new StubEntity(props, id);
    expect(entity._id).toBe(id);
    expect(uuidValidate(entity._id)).toBeTruthy();
  });

  it('should convert a entity to a javascript object', () => {
    //testando o metodo para transforamr o objeto em json
    const props = { prop1: 'value1', prop2: 15 };
    const id = '0c3cbc43-881d-4566-a91e-15364d2ee756';
    const entity = new StubEntity(props, id);
    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    });
  });
});
