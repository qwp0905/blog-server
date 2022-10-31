import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../@types/test'
import { PAGE_LIMIT } from '../../../../shared/constants/article'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'
import { CommentEntity } from '../../infrastructure/entities/comment.entity'
import { FindCommentHandler } from './find-comment.handler'
import { FindCommentQuery, IFindCommentQuery } from './find-comment.query'

const mockDataSource = () => ({
  createQueryBuilder: jest.fn()
})

const mockQueryBuilder = () => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
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

describe('Comment-FindComment', () => {
  let handler: FindCommentHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindCommentHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindCommentQuery
    let queryBuilder: Mock<SelectQueryBuilder<any>>
    const queryResult = []

    beforeEach(() => {
      query = new FindCommentQuery(123).context

      queryBuilder = mockQueryBuilder()

      dataSource.createQueryBuilder.mockReturnValue(queryBuilder)
      queryBuilder.execute.mockResolvedValue(queryResult)
    })

    it('test', async () => {
      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(dataSource.createQueryBuilder).toBeCalled()
      expect(queryBuilder.from).toBeCalledWith(CommentEntity, 'A')
      expect(queryBuilder.innerJoin).toBeCalledWith(
        AccountEntity,
        'B',
        'B.id = A.account_id'
      )
      expect(queryBuilder.where).toBeCalledWith('A.article_id = :article_id', {
        article_id: 123
      })
      expect(queryBuilder.orderBy).toBeCalledWith('A.created_at', 'DESC')
      expect(queryBuilder.limit).toBeCalledWith(PAGE_LIMIT + 1)
      expect(queryBuilder.offset).toBeCalledWith(0)
      expect(queryBuilder.execute).toBeCalled()
    })
  })
})
