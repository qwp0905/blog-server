import { NextFunction, Request, Response } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Validator } from '../../../shared/lib/validator'
import { CreateCommentCommand } from '../application/command/create-comment/create-comment.command'
import { DeleteCommentCommand } from '../application/command/delete-comment/delete-comment.command'
import { UpdateCommentCommand } from '../application/command/update-comment/update-comment.command'
import { FindCommentQuery } from '../application/query/find-comment.query'
import { CommentController } from './comment.controller'

jest.mock('../../../middlewares/auth.middleware', () => ({
  Auth: jest.fn().mockReturnValue((req: Request, res: Response, next: NextFunction) => {
    next()
  })
}))

const mockCommandBus = (): Mock<CommandBus> => ({
  execute: jest.fn()
})

const mockQueryBus = (): Mock<QueryBus> => ({
  execute: jest.fn()
})

const mockValidator = (): Mock<Validator> => ({
  numberOptionalPipe: jest.fn().mockImplementation((a) => +a),
  string: jest.fn().mockImplementation((a) => a),
  numberPipe: jest.fn().mockImplementation((a) => +a),
  number: jest.fn().mockImplementation((a) => a)
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

  describe('2. create TEST', () => {
    let req: Request
    let command: CreateCommentCommand

    beforeEach(() => {
      req = {
        body: {
          article_id: 123,
          content: 'content'
        },
        user: 456
      } as unknown as Request

      command = new CreateCommentCommand(456, 123, 'content')
    })

    it('1. test', async () => {
      const result = controller.create(req)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.number).toBeCalledWith(123)
      expect(validator.string).toBeCalledWith('content')
    })
  })

  describe('3. delete TEST', () => {
    let req: Request
    let command: DeleteCommentCommand

    beforeEach(() => {
      req = {
        params: {
          id: '123'
        },
        user: 456
      } as unknown as Request

      command = new DeleteCommentCommand(456, 123)
    })

    it('1. test', async () => {
      const result = controller.delete(req)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.numberPipe).toBeCalledWith('123')
    })
  })

  describe('4. update TEST', () => {
    let req: Request
    let command: UpdateCommentCommand

    beforeEach(() => {
      req = {
        params: {
          id: '123'
        },
        body: {
          content: 'new_content'
        },
        user: 456
      } as unknown as Request

      command = new UpdateCommentCommand(456, 123, 'new_content')
    })

    it('1. test', async () => {
      const result = controller.update(req)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.numberPipe).toBeCalledWith('123')
      expect(validator.string).toBeCalledWith('new_content')
    })
  })
})
