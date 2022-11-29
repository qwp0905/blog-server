import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../../@types/test'
import { ArticleEntity } from '../../../infrastructure/entities/article.entity'
import { FindArticleDetailHandler } from './find-article-detail.handler'
import {
  FindArticleDetailQuery,
  IFindArticleDetailQuery
} from './find-article-detail.query'

const mockDataSource = (): Mock<DataSource> => ({
  createQueryBuilder: jest.fn()
})

const mockQueryBuilder = (): Mock<SelectQueryBuilder<any>> => ({
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
  getRawOne: jest.fn()
})

describe('Article-FindArticleDetail', () => {
  let handler: FindArticleDetailHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindArticleDetailHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindArticleDetailQuery
    let queryBuilder: Mock<SelectQueryBuilder<any>>
    let subQuery: Mock<SelectQueryBuilder<any>>
    const queryResult = {}

    beforeEach(() => {
      query = new FindArticleDetailQuery(123).context

      queryBuilder = mockQueryBuilder()
      subQuery = mockQueryBuilder()

      queryBuilder.addSelect.mockImplementation((cb) => {
        if (typeof cb === 'function') {
          cb(subQuery)
        }
        return queryBuilder
      })

      dataSource.createQueryBuilder.mockReturnValue(queryBuilder)
      queryBuilder.getRawOne.mockResolvedValue(queryResult)
    })

    it('1. test', async () => {
      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(queryBuilder.from).toBeCalledWith(ArticleEntity, 'A')
      expect(queryBuilder.where).toBeCalledWith('A.id = :article_id', { article_id: 123 })
      expect(queryBuilder.getRawOne).toBeCalled()
    })
  })
})
