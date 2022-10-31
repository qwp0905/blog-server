import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { CreateAccountCommand } from '../application/command/create-account/create-account.command'
import { FindProfileQuery } from '../application/query/find-profile.query'
import { AccountController } from './account.controller'

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

describe('Account-Controller', () => {
  let controller: AccountController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()

    controller = new AccountController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus
    )
  })

  describe('1. create TEST', () => {
    let request: Request
    let command: CreateAccountCommand

    beforeEach(() => {
      request = {
        body: {
          email: 'email',
          password: 'password',
          nickname: 'nickname'
        }
      } as Request

      command = new CreateAccountCommand('email', 'password', 'nickname')
    })

    it('1. email 없는 경우', async () => {
      request.body.email = ''

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('2. email 타입', async () => {
      request.body.email = 123

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('3. password 없는 경우', async () => {
      request.body.password = null

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('4. password 타입', async () => {
      request.body.password = []

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('5. nickname 없는 경우', async () => {
      request.body.nickname = NaN

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('6. nickname 타입', async () => {
      request.body.nickname = () => ({})

      const result = controller.create(request)

      await expect(result).rejects.toThrowError()
      expect(commandBus.execute).not.toBeCalled()
    })

    it('7. 성공', async () => {
      const result = controller.create(request)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
    })
  })

  describe('2. findProfile TEST', () => {
    let request: Request
    let query: FindProfileQuery

    beforeEach(() => {
      request = {
        params: {
          id: '123'
        }
      } as unknown as Request

      query = new FindProfileQuery(123)

      queryBus.execute.mockResolvedValue('result')
    })

    it('1. id 없는 경우', async () => {
      request.params.id = undefined

      const result = controller.findProfile(request)

      await expect(result).rejects.toThrowError()
      expect(queryBus.execute).not.toBeCalled()
    })

    it('2. id 타입', async () => {
      request.params.id = 'undefined'

      const result = controller.findProfile(request)

      await expect(result).rejects.toThrowError()
      expect(queryBus.execute).not.toBeCalled()
    })

    it('3. 성공', async () => {
      const result = controller.findProfile(request)

      await expect(result).resolves.toEqual('result')
      expect(queryBus.execute).toBeCalledWith(query)
    })
  })
})
