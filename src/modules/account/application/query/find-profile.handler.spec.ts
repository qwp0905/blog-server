import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../@types/test'
import { AccountEntity } from '../../infrastructure/entities/account.entity'
import { FindProfileHandler } from './find-profile.handler'
import {
  FindProfileQuery,
  FindProfileResult,
  IFindProfileQuery
} from './find-profile.query'

const mockDataSource = () => ({
  createQueryBuilder: jest.fn()
})

const mockQueryBuilder = () => ({
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getRawOne: jest.fn()
})

describe('Account-findProfile', () => {
  let handler: FindProfileHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindProfileHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindProfileQuery
    let queryResult: FindProfileResult
    let queryBuilder: Mock<SelectQueryBuilder<any>>
    let subQuery: Mock<SelectQueryBuilder<any>>

    beforeEach(() => {
      query = new FindProfileQuery(123123).context

      queryBuilder = mockQueryBuilder()
      subQuery = mockQueryBuilder()

      queryResult = {
        articles: 123,
        created_at: new Date(),
        id: 123123,
        nickname: 'nickname'
      }

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
      expect(dataSource.createQueryBuilder).toBeCalled()

      expect(queryBuilder.select).toBeCalled()
      expect(queryBuilder.addSelect).toBeCalled()
      expect(queryBuilder.from).toBeCalledWith(AccountEntity, 'A')
      expect(queryBuilder.where).toBeCalledWith('id = :id', { id: 123123 })
      expect(queryBuilder.getRawOne).toBeCalled()
    })
  })
})
