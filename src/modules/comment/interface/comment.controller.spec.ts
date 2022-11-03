import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Validator } from '../../../shared/lib/validator'
import { FindCommentQuery } from '../application/query/find-comment.query'
import { CommentController } from './comment.controller'

jest.mock('../../../middlewares/auth.middleware', () => ({
  Auth: jest.fn().mockReturnValue((req, res, next) => {
    next()
  })
}))

const mockCommandBus = () => ({
  execute: jest.fn()
})

const mockQueryBus = () => ({
  execute: jest.fn()
})

const mockValidator = () => ({
  numberOptionalPipe: jest.fn().mockImplementation((a) => +a),
  string: jest.fn().mockImplementation((a) => a),
  stringOptional: jest.fn().mockImplementation((a) => a),
  numberPipe: jest.fn().mockImplementation((a) => +a),
  stringArray: jest.fn().mockImplementation((a) => a)
})

describe('Comment-Controller', () => {
  let controller: CommentController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>
  let validator: Mock<Validator>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()
    validator = mockValidator()

    controller = new CommentController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus,
      validator as Validator
    )
  })

  describe('1. find TEST', () => {
    let request: Request
    let query: FindCommentQuery

    beforeEach(() => {
      request = {
        query: {
          article_id: '123',
          page: '12'
        }
      } as unknown as Request

      query = new FindCommentQuery(123, 12)

      queryBus.execute.mockResolvedValue([1, 2, 3])
    })

    it('1. test', async () => {
      const result = controller.find(request)

      await expect(result).resolves.toEqual([1, 2, 3])
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validator.numberPipe).toBeCalledWith('123')
      expect(validator.numberOptionalPipe).toBeCalledWith('12')
    })
  })
})
