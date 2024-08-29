import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository-contract';

export type SortDiretion = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page: number;
  perPage: number;
  sort: string | null;
  sortDir: SortDiretion | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDiretion | null;
  protected _filter?: string | null;

  constructor(props: SearchProps) {
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get perPage(): number {
    return this._perPage;
  }

  set perPage(value: number) {
    let _perPage = +value;
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage;
    }

    this._perPage = _perPage;
  }

  get sort(): string | null {
    return this._sort;
  }

  set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDir(): SortDiretion | null {
    return this._sortDir;
  }

  set sortDir(value: SortDiretion | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter() {
    return this._filter;
  }

  set filter(value: string | null) {
    this.filter =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  seach(props: SearchParams): Promise<SearchOutput>;
}
