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
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  let hashProvider: HashProvider;
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
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    updatePasswordDto = {
      oldPassword: 'old_password',
      password: 'new_password',
    };
    //a cada teste limpa o banco de dados para não gerar conflito
    await prismaService.user.deleteMany();
    const hashPassword = await hashProvider.generateHash('old_password');
    entity = new UserEntity(userDataBuilder({ password: hashPassword }));
    await repository.insert(entity);
  });

  describe('PATCH /users/:id', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findById(res.body.data.id);
      const checkPassword = await hashProvider.compareHash(
        'new_password',
        user.password,
      );
      expect(checkPassword).toBeTruthy();
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');

      expect(res.body.message).toEqual([
        'password must be a string',
        'password should not be empty',
        'oldPassword must be a string',
        'oldPassword should not be empty',
      ]);
    });

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send(updatePasswordDto)
        .expect(404);

      expect(res.body.error).toBe('Not Found');

      expect(res.body.message).toEqual(`UserModel not found using id fakeId`);
    });

    it('should return a error with 422 code when the password field is invalid', async () => {
      delete updatePasswordDto.password;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');

      expect(res.body.message).toEqual([
        'password must be a string',
        'password should not be empty',
      ]);
    });

    it('should return a error with 422 code when the oldPassword field is invalid', async () => {
      delete updatePasswordDto.oldPassword;
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');

      expect(res.body.message).toEqual([
        'oldPassword must be a string',
        'oldPassword should not be empty',
      ]);
    });

    it('should return a error with 422 code when the password does not match', async () => {
      updatePasswordDto.oldPassword = 'fake';
      await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(422)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Old password does not match',
        });
    });
  });
});
