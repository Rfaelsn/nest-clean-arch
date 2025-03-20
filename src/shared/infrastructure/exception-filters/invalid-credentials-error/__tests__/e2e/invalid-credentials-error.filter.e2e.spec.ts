import { Controller, Get, INestApplication } from '@nestjs/common';
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Invalid credentials');
  }
}

describe('InvalidCredentialsErrorFilter', () => {
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
    app.useGlobalFilters(new InvalidCredentialsErrorFilter());
    //inicia app mock
    await app.init();
  });

  it('should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined();
  });

  it('should catch a InvalidCredentialsError', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid credentials',
    });
  });
});
