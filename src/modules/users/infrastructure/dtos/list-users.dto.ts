import { SortDirection } from "@/shared/domain/repositories/searchable-repository-contract";
import { ListUsersUseCase } from "../../application/usecases/list-users.usecase";

export class ListUsersDto implements ListUsersUseCase.Input {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}
