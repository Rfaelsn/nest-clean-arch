import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contract';

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page property', () => {
      const sut = new SearchParams();
      expect(sut.page).toBe(1);

      const params = [
        { page: null as any, expect: 1 },
        { page: undefined as any, expect: 1 },
        { page: '' as any, expect: 1 },
        { page: 'test' as any, expect: 1 },
        { page: 0, expect: 1 },
        { page: -1, expect: 1 },
        { page: 5.5, expect: 1 },
        { page: true, expect: 1 },
        { page: false, expect: 1 },
        { page: {}, expect: 1 },
        { page: 1, expect: 1 },
        { page: 2, expect: 2 },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ page: i.page }).page).toBe(i.expect);
      });
    });

    it('perPage property', () => {
      const sut = new SearchParams();
      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null as any, expect: 15 },
        { perPage: undefined as any, expect: 15 },
        { perPage: '' as any, expect: 15 },
        { perPage: 'test' as any, expect: 15 },
        { perPage: 0, expect: 15 },
        { perPage: -1, expect: 15 },
        { perPage: 5.5, expect: 15 },
        { perPage: true, expect: 15 },
        { perPage: false, expect: 15 },
        { perPage: {}, expect: 15 },
        { perPage: 1, expect: 1 },
        { perPage: 25, expect: 25 },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ perPage: i.perPage }).perPage).toBe(i.expect);
      });
    });

    it('sort property', () => {
      const sut = new SearchParams();
      expect(sut.sort).toBeNull();

      const params = [
        { sort: null as any, expect: null },
        { sort: undefined as any, expect: null },
        { sort: '', expect: null },
        { sort: 'test', expect: 'test' },
        { sort: 0, expect: '0' },
        { sort: -1, expect: '-1' },
        { sort: 5.5, expect: '5.5' },
        { sort: true, expect: 'true' },
        { sort: false, expect: 'false' },
        { sort: {}, expect: '[object Object]' },
        { sort: 1, expect: '1' },
        { sort: 25, expect: '25' },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ sort: i.sort }).sort).toBe(i.expect);
      });
    });

    it('sortDir property', () => {
      let sut = new SearchParams();
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: '' });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: undefined });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams();
      const params = [
        { sortDir: null as any, expect: 'desc' },
        { sortDir: undefined as any, expect: 'desc' },
        { sortDir: '', expect: 'desc' },
        { sortDir: 'test', expect: 'desc' },
        { sortDir: 0, expect: 'desc' },
        { sortDir: 'ASC', expect: 'asc' },
        { sortDir: 'DESC', expect: 'desc' },
        { sortDir: 'asc', expect: 'asc' },
        { sortDir: 'desc', expect: 'desc' },
        { sortDir: {}, expect: 'desc' },
      ];

      params.forEach((i) => {
        expect(
          new SearchParams({ sort: 'teste', sortDir: i.sortDir }).sortDir,
        ).toBe(i.expect);
      });
    });

    it('filter property', () => {
      const sut = new SearchParams();
      expect(sut.filter).toBeNull();

      const params = [
        { filter: null as any, expect: null },
        { filter: undefined as any, expect: null },
        { filter: '', expect: null },
        { filter: 'test', expect: 'test' },
        { filter: 0, expect: '0' },
        { filter: -1, expect: '-1' },
        { filter: 5.5, expect: '5.5' },
        { filter: true, expect: 'true' },
        { filter: false, expect: 'false' },
        { filter: {}, expect: '[object Object]' },
        { filter: 1, expect: '1' },
        { filter: 25, expect: '25' },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ filter: i.filter }).filter).toBe(i.expect);
      });
    });
  });

  describe('SearchResult tests', () => {
    it('constructor tests', () => {
      //testando to json
      let sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      //a ideia do toJSON é trazer apenas os atributos tirando os metodos
      expect(sut.toJSON()).toStrictEqual({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      //testando propriedades sort,sortDir,filter se passadas
      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      //a ideia do toJSON é trazer apenas os atributos tirando os metodos
      expect(sut.toJSON()).toStrictEqual({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      //testando se o lastPage calcula correto em caso de valores não multiplos de perPage
      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });
      expect(sut.lastPage).toBe(1);

      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 54,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });
      expect(sut.lastPage).toBe(6);
    });
  });
});
