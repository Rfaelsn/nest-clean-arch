import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SigninUseCase } from '../../application/usecases/signin.usecase';

export class SigninDto implements SigninUseCase.Input {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
