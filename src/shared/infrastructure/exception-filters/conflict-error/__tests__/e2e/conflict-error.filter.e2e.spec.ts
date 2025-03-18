import { Controller, Get, INestApplication } from '@nestjs/common';
import { ConflictErrorFilter } from '../../conflict-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ConflictError('Conflicting data');
  }
}

describe('ConflictErrorFilter e2e', () => {
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
    app.useGlobalFilters(new ConflictErrorFilter());
    //inicia app mock
    await app.init();
  });

  it('should be defined', () => {
    expect(new ConflictErrorFilter()).toBeDefined();
  });

  it('should catch a ConflictError', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    });
  });
});
