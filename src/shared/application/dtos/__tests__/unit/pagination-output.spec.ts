import { UserEntity } from "@/modules/users/domain/entities/user.entity"
import { userDataBuilder } from "@/modules/users/domain/testing/helpers/user-data-builder"
import { PaginationOutputMapper } from "../../pagination-output";
import { SearchResult } from "@/shared/domain/repositories/searchable-repository-contract";


describe('PaginationOutputMapper unit tests',()=>{
  it('should convert SearchResult in output',()=>{
    const result = new SearchResult({
      items: ['fake'] as any,
      total:1,
      currentPage:1,
      perPage:1,
      sort:'',
      sortDir:'',
      filter:'fake'
    });

    const sut = PaginationOutputMapper.toOutput(result.items,result)
    expect(sut).toStrictEqual({
      items:result.items,
      total:1,
      currentPage:1,
      lastPage:1,
      perPage:1
    })
  })
})
