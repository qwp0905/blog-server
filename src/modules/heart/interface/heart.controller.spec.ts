import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { ValidationPipe } from '../../../shared/lib/validation-pipe'
import { CreateHeartCommand } from '../application/command/create-heart/create-heart.command'
import { DeleteHeartCommand } from '../application/command/delete-heart/delete-heart.command'
import { FindHeartQuery } from '../application/query/find-heart.query'
import { HeartController } from './heart.controller'

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
  numberPipe: jest.fn().mockImplementation((a) => +a)
})

describe('Heart-Controller', () => {
  let controller: HeartController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>
  let validator: Mock<ValidationPipe>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()
    validator = mockValidationPipe()

    controller = new HeartController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus,
      validator as ValidationPipe
    )
  })

  describe('1. find TEST', () => {
    let req: Request
    let query: FindHeartQuery

    beforeEach(() => {
      req = {
        params: { id: '123' },
        user: 345
      } as unknown as Request

      query = new FindHeartQuery(345, 123)
      queryBus.execute.mockResolvedValue(true)
    })

    it('1. test', async () => {
      const result = controller.find(req)

      await expect(result).resolves.toEqual(true)
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validator.numberPipe).toBeCalledWith('123')
    })
  })

  describe('2. create TEST', () => {
    let req: Request
    let command: CreateHeartCommand

    beforeEach(() => {
      req = {
        params: { id: '123' },
        user: 345
      } as unknown as Request

      command = new CreateHeartCommand(345, 123)
    })

    it('1. test', async () => {
      const result = controller.create(req)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.numberPipe).toBeCalledWith('123')
    })
  })

  describe('3. delete TEST', () => {
    let req: Request
    let command: DeleteHeartCommand

    beforeEach(() => {
      req = {
        params: { id: '123' },
        user: 345
      } as unknown as Request

      command = new DeleteHeartCommand(345, 123)
    })

    it('1. test', async () => {
      const result = controller.delete(req)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.numberPipe).toBeCalledWith('123')
    })
  })
})
