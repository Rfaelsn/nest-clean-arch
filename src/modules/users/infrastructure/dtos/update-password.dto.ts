import { UpdatePasswordUseCase } from '../../application/usecases/update-password-user.usecase';

export class UpdatePasswordDto implements Omit<UpdatePasswordUseCase.Input,'id'> {
  password: string;
  oldPassword: string;
}
