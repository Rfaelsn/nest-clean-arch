import { Controller, INestApplication, Put } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import request from 'supertest';
import { NotFoundError } from '@/shared/application/errors/bad-request-error';
import { NotFoundErrorFilter } from '../../not-found-error.filter';

@Controller('stub')
class StubController {
  @Put(':id')
  index() {
    throw new NotFoundError('UserModel not found');
  }
}

describe('NotFoundErrorFilter e2e', () => {
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
    app.useGlobalFilters(new NotFoundErrorFilter());
    //inicia app mock
    await app.init();
  });

  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  it('should catch a NotFoundError', () => {
    return request(app.getHttpServer()).put('/stub/fakeId').expect(404).expect({
      statusCode: 404,
      error: 'Not Found',
      message: 'UserModel not found',
    });
  });
});
