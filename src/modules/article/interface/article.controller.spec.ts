import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { ValidationPipe } from '../../../shared/lib/validation-pipe'
import { FindArticleAllQuery } from '../application/query/find-article-all/find-article-all.query'
import { FindArticleDetailQuery } from '../application/query/find-detail/find-article-detail.query'
import { FindTagsQuery } from '../application/query/find-tags/find-tags.query'
import { ArticleController } from './article.controller'

jest.mock('../../../middlewares/auth.middleware', () => ({
  Auth: jest.fn().mockReturnValue((req, res, next) => {
    next()
  })
}))

const mockCommandBus = (): Mock<CommandBus> => ({
  execute: jest.fn()
})

const mockQueryBus = (): Mock<QueryBus> => ({
  execute: jest.fn()
})

const mockValidationPipe = (): Mock<ValidationPipe> => ({
  numberOptionalPipe: jest.fn().mockImplementation((a) => +a),
  string: jest.fn().mockImplementation((a) => a),
  stringOptional: jest.fn().mockImplementation((a) => a),
  numberPipe: jest.fn().mockImplementation((a) => +a),
  stringArray: jest.fn().mockImplementation((a) => a)
})

describe('Article-Controller', () => {
  let controller: ArticleController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>
  let validationPipe: Mock<ValidationPipe>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()
    validationPipe = mockValidationPipe()

    controller = new ArticleController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus,
      validationPipe as ValidationPipe
    )
  })

  describe('1. find TEST', () => {
    let req: Request
    let query: FindArticleAllQuery

    beforeEach(() => {
      req = {
        query: {
          id: '1',
          tag: 'tag',
          page: '2'
        }
      } as unknown as Request

      query = new FindArticleAllQuery(2, 'tag', 1)

      queryBus.execute.mockResolvedValue('result')
    })

    it('1. test', async () => {
      const result = controller.find(req)

      await expect(result).resolves.toEqual('result')
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validationPipe.numberOptionalPipe).toBeCalledWith('2')
      expect(validationPipe.numberOptionalPipe).toBeCalledWith('1')
      expect(validationPipe.stringOptional).toBeCalledWith('tag')
    })
  })

  describe('2. findDetail TEST', () => {
    let req: Request
    let query: FindArticleDetailQuery

    beforeEach(() => {
      req = {
        params: {
          id: '123'
        }
      } as unknown as Request

      query = new FindArticleDetailQuery(123)

      queryBus.execute.mockResolvedValue({ abc: 123 })
    })

    it('1. test', async () => {
      const result = controller.findDetail(req)

      await expect(result).resolves.toEqual({ abc: 123 })
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validationPipe.numberPipe).toBeCalledWith('123')
    })
  })

  describe('3. findTags TEST', () => {
    let req: Request
    let query: FindTagsQuery

    beforeEach(() => {
      req = {
        query: {
          id: '123'
        }
      } as unknown as Request

      query = new FindTagsQuery(123)

      queryBus.execute.mockResolvedValue(['tags'])
    })

    it('1. test', async () => {
      const result = controller.findTags(req)

      await expect(result).resolves.toEqual(['tags'])
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validationPipe.numberOptionalPipe).toBeCalledWith('123')
    })
  })
})
