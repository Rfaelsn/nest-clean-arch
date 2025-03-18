import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@/modules/users/domain/repositories/user.repository';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { UsersController } from '../../users.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { userDataBuilder } from '@/modules/users/domain/testing/helpers/user-data-builder';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    // o module get recebe o nome do provider configurado no container de modulo do Nest
    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    //a cada teste limpa o banco de dados para não gerar conflito
    await prismaService.user.deleteMany();
    //cria uma nova entidade para usar nos casos de update
    entity = new UserEntity(userDataBuilder({}));
    await repository.insert(entity);
  });

  describe('GET /users/:id', () => {
    it('should get a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${entity._id}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const presenter = UsersController.userToResponse(entity.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');

      expect(res.body.message).toEqual([
        'name must be a string',
        'name should not be empty',
      ]);
    });

    //para reconhecer o retorno do nosso erro personalizado temos que cadastrar os exception filters
    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .get('/users/fakeId')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using id fakeId',
        });
    });
  });
});
