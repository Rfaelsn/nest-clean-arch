import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateUserUseCase } from '../../application/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsNotEmpty()
  @IsString()
  name: string;
}
