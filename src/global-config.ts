import { Reflector } from '@nestjs/core';

import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      //erro padrão para quando der erro na pipe (unprocessable entity)
      errorHttpStatusCode: 422,
      //desconsidera atributos a mais que forem enviados que não fazem parte dos dtos
      whitelist: true,
      //desconsidera atributos maliciosos
      forbidNonWhitelisted: true,
      //converte automaticamente os dados do json enviado
      transform: true,
    }),
  );

  //config para usar o class-transformer para serialização no Nest - classSerializer
  //config para formatar os dados de reponse das rotas -- wrappeData
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  //config que permite configurar os erros do nest para personalizar o retorno com erros personalizados
  app.useGlobalFilters(new ConflictErrorFilter(), new NotFoundErrorFilter());
}
