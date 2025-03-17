import { IsNotEmpty, IsString } from 'class-validator';
import { UpdatePasswordUseCase } from '../../application/usecases/update-password-user.usecase';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;
}
