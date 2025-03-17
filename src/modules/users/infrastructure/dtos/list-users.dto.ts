import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract';
import { ListUsersUseCase } from '../../application/usecases/list-users.usecase';
import { IsOptional } from 'class-validator';

export class ListUsersDto implements ListUsersUseCase.Input {
  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  sortDir?: SortDirection;

  @IsOptional()
  filter?: string;
}
