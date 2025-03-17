import { of } from 'rxjs';
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = {
      name: 'Test name',
      email: 'a@a.com',
      password: 'fake',
    };
  });

  it('should be defined', () => {
    expect(new WrapperDataInterceptor()).toBeDefined();
  });

  it('should wrapper with data key', () => {
    //por convenção var/const com observable possuem $
    // função of() retorna um observable
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    //adicionamos ao observable a implementação do teste para capturar o valor tratado
    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual({ data: props });
      },
    });
  });

  it('should not wrapper when meta key is present', () => {
    const result = { data: [props], meta: { total: 1 } };

    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({
      next: (value) => {
        expect(value).toEqual(result);
      },
    });
  });
});
