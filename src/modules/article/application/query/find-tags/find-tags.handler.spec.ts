import { DataSource, SelectQueryBuilder } from 'typeorm'
import { Mock } from '../../../../../@types/test'
import { FindTagsHandler } from './find-tags.handler'
import { FindTagsQuery, IFindTagsQuery } from './find-tags.query'

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
  execute: jest.fn(),
  getRawOne: jest.fn()
})

describe('Article-FindTags', () => {
  let handler: FindTagsHandler
  let dataSource: Mock<DataSource>

  beforeEach(() => {
    dataSource = mockDataSource()

    handler = new FindTagsHandler(dataSource as unknown as DataSource)
  })

  describe('TEST', () => {
    let query: IFindTagsQuery
    let queryBuilder1: Mock<SelectQueryBuilder<any>>
    let queryBuilder2: Mock<SelectQueryBuilder<any>>
    let subQuery: Mock<SelectQueryBuilder<any>>
    const queryResult = ['total', 'result1', 'result2']

    beforeEach(() => {
      query = new FindTagsQuery().context

      queryBuilder1 = mockQueryBuilder()
      queryBuilder2 = mockQueryBuilder()
      subQuery = mockQueryBuilder()

      queryBuilder1.addSelect.mockImplementation((cb) => {
        if (typeof cb === 'function') {
          cb(subQuery)
        }
        return queryBuilder1
      })

      queryBuilder2.addSelect.mockImplementation((cb) => {
        if (typeof cb === 'function') {
          cb(subQuery)
        }
        return queryBuilder2
      })

      dataSource.createQueryBuilder.mockReturnValue(queryBuilder2)
      dataSource.createQueryBuilder.mockReturnValueOnce(queryBuilder1)
      queryBuilder2.getRawOne.mockResolvedValue('total')
      queryBuilder1.execute.mockResolvedValue(['result1', 'result2'])
    })

    it('1. 유저 아이디 없는 경우', async () => {
      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(dataSource.createQueryBuilder).toBeCalledTimes(2)
      expect(queryBuilder2.select).toBeCalledWith(`'전체'`, 'tag_name')
      expect(queryBuilder1.where).toBeCalledWith('1 = 1', {})
      expect(queryBuilder1.execute).toBeCalled()
      expect(queryBuilder2.where).toBeCalledWith('1 = 1', {})
      expect(queryBuilder2.getRawOne).toBeCalled()
    })

    it('2. 유저 아이디 있는 경우', async () => {
      query = new FindTagsQuery(321).context

      const result = handler.execute(query)

      await expect(result).resolves.toEqual(queryResult)
      expect(dataSource.createQueryBuilder).toBeCalledTimes(2)
      expect(queryBuilder2.select).toBeCalledWith(`'전체'`, 'tag_name')
      expect(queryBuilder1.where).toBeCalledWith(`A.account_id = :account_id`, {
        account_id: 321
      })
      expect(queryBuilder1.execute).toBeCalled()
      expect(queryBuilder2.where).toBeCalledWith(`A.account_id = :account_id`, {
        account_id: 321
      })
      expect(queryBuilder2.getRawOne).toBeCalled()
    })
  })
})
