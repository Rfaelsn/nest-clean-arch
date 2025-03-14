import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../pagination.presenter';
import { CollectionPresenter } from '../../collection.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter', () => {
  let sut: StubCollectionPresenter;

  beforeEach(() => {
    sut = new StubCollectionPresenter({
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
      total: 4,
    });
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
      expect(sut['paginationPresenter'].currentPage).toBe(1);
      expect(sut['paginationPresenter'].perPage).toBe(2);
      expect(sut['paginationPresenter'].lastPage).toBe(2);
      expect(sut['paginationPresenter'].total).toBe(4);
    });

    it('should set string values', () => {
      const sut = new PaginationPresenter({
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '3' as any,
        total: '4' as any,
      });
      expect(sut.currentPage).toEqual('1');
      expect(sut.perPage).toEqual('2');
      expect(sut.lastPage).toEqual('3');
      expect(sut.total).toEqual('4');
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
          total: 4,
        },
      });
    });
  });
});
