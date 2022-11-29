import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../@types/test'
import { HeartEntity } from '../../infrastructure/entities/heart.entity'
import { FindHeartHandler } from './find-heart.handler'
import { FindHeartQuery, IFindHeartQuery } from './find-heart.query'

const mockDataSource = (): Mock<DataSource> => ({
  createQueryBuilder: jest.fn()
})

const mockQueryBuilder = (): Mock<SelectQueryBuilder<any>> => ({
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getRawOne: jest.fn()
})

describe('Heart-FindHeart', () => {
  let handler: FindHeartHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindHeartHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindHeartQuery
    let queryBuilder: Mock<SelectQueryBuilder<any>>

    beforeEach(() => {
      query = new FindHeartQuery(123, 456).context

      queryBuilder = mockQueryBuilder()

      dataSource.createQueryBuilder.mockReturnValue(queryBuilder)
      queryBuilder.getRawOne.mockResolvedValue({})
    })

    it('1. test', async () => {
      const result = handler.execute(query)

      await expect(result).resolves.toEqual(true)
      expect(dataSource.createQueryBuilder).toBeCalled()
      expect(queryBuilder.from).toBeCalledWith(HeartEntity, 'heart')
      expect(queryBuilder.where).toBeCalledWith('account_id = :account_id', {
        account_id: 123
      })
      expect(queryBuilder.andWhere).toBeCalledWith('article_id = :article_id', {
        article_id: 456
      })
      expect(queryBuilder.getRawOne).toBeCalled()
    })
  })
})
