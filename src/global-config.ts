import { Reflector } from '@nestjs/core';

import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  //config para usar o class-transformer para serialização no Nest - classSerializer
  //config para formatar os dados de reponse das rotas -- wrappeData
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
