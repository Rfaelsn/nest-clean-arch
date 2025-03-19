import { Controller, INestApplication, Patch } from '@nestjs/common';
import { InvalidPasswordErrorFilter } from '../../invalid-password-error.filter';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Patch()
  index() {
    throw new InvalidPasswordError('Old password does not match');
  }
}

describe('InvalidPasswordErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    //cria modulo mockado
    //adiciona controller stub
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();

    //cria aplicacao nest mockada
    app = module.createNestApplication();

    //adiciona o global filter no nosso filter de erro (sut)
    app.useGlobalFilters(new InvalidPasswordErrorFilter());
    //inicia app mock
    await app.init();
  });

  it('should be defined', () => {
    expect(new InvalidPasswordErrorFilter()).toBeDefined();
  });

  it('should catch a InvalidPasswordError', () => {
    return request(app.getHttpServer()).patch('/stub').expect(422).expect({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: 'Old password does not match',
    });
  });
});
