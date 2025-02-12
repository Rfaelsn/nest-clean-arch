import { UserEntity } from "../../domain/entities/user.entity";

export type UserOutputDto = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class UserOutputMapper{
  static toOutput(entity:UserEntity):UserOutputDto{
    return entity.toJSON();
  }
}
