import { UpdateUserUseCase } from '../../application/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input,'id'> {
  name: string;
}
