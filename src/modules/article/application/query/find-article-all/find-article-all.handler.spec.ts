import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../../@types/test'
import { PAGE_LIMIT } from '../../../../../shared/constants/article'
import { FindArticleAllHandler } from './find-article-all.handler'
import { FindArticleAllQuery, IFindArticleAllQuery } from './find-article-all.query'

const mockDataSource = () => ({
  createQueryBuilder: jest.fn()
})

const mockQueryBuilder = () => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn(),
  innerJoin: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  execute: jest.fn()
})

describe('Article-FindArticleAll', () => {
  let handler: FindArticleAllHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindArticleAllHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindArticleAllQuery
    let queryBuilder: Mock<SelectQueryBuilder<any>>
    const queryResult = []
    let subQuery: Mock<SelectQueryBuilder<any>>

    beforeEach(() => {
      query = new FindArticleAllQuery(20).context

      queryBuilder = mockQueryBuilder()
      subQuery = mockQueryBuilder()

      queryBuilder.addSelect.mockImplementation((cb) => {
        if (typeof cb === 'function') {
          cb(subQuery)
        }
        return queryBuilder
      })

      dataSource.createQueryBuilder.mockReturnValue(queryBuilder)
      queryBuilder.execute.mockResolvedValue(queryResult)
    })

    it('1. 전체 게시물 조회', async () => {
      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(dataSource.createQueryBuilder).toBeCalledTimes(1)

      expect(queryBuilder.select).toBeCalled()
      expect(queryBuilder.addSelect).toBeCalled()
      expect(queryBuilder.innerJoin).toBeCalled()
      expect(queryBuilder.where).toBeCalledWith('1 = 1', {})
      expect(queryBuilder.andWhere).toBeCalledWith('1 = 1', {})
      expect(queryBuilder.groupBy).toBeCalledWith('A.id')
      expect(queryBuilder.orderBy).toBeCalledWith('A.created_at', 'DESC')
      expect(queryBuilder.limit).toBeCalledWith(PAGE_LIMIT + 1)
      expect(queryBuilder.offset).toBeCalledWith(PAGE_LIMIT * 19)
      expect(queryBuilder.execute).toBeCalled()
    })

    it('2. 일부 게시물 조회', async () => {
      query = new FindArticleAllQuery(undefined, 'tag', 123).context

      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(dataSource.createQueryBuilder).toBeCalledTimes(1)

      expect(queryBuilder.select).toBeCalled()
      expect(queryBuilder.addSelect).toBeCalled()
      expect(queryBuilder.innerJoin).toBeCalled()
      expect(queryBuilder.where).toBeCalledWith('C.tag_name = :tag', { tag: 'tag' })
      expect(queryBuilder.andWhere).toBeCalledWith('A.account_id = :account_id', {
        account_id: 123
      })
      expect(queryBuilder.groupBy).toBeCalledWith('A.id')
      expect(queryBuilder.orderBy).toBeCalledWith('A.created_at', 'DESC')
      expect(queryBuilder.limit).toBeCalledWith(PAGE_LIMIT + 1)
      expect(queryBuilder.offset).toBeCalledWith(0)
      expect(queryBuilder.execute).toBeCalled()
    })
  })
})
