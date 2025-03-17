import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignupUseCase } from '../../application/usecases/signup.usecase';

export class SignupDto implements SignupUseCase.Input {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
