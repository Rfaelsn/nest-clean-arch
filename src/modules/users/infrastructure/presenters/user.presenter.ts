import { Transform } from 'class-transformer';
import { UserOutputDto } from '../../application/dtos/user-output.dto';

export class UserPresenter {
  id: string;
  name: string;
  email: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: UserOutputDto) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}
