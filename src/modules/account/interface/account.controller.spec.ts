import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Validator } from '../../../shared/lib/validator'
import { CreateAccountCommand } from '../application/command/create-account/create-account.command'
import { LoginCommand } from '../application/command/login/login.command'
import { LogoutCommand } from '../application/command/logout/logout.command'
import { RefreshTokenCommand } from '../application/command/refresh-token/refresh-token.command'
import { UpdateAccountCommand } from '../application/command/update-account/update-account.command'
import { FindProfileQuery } from '../application/query/find-profile.query'
import { IAccount } from '../domain/account'
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

const mockValidator = () => ({
  string: jest.fn().mockImplementation((a) => a),
  stringOptional: jest.fn().mockImplementation((a) => a),
  numberPipe: jest.fn().mockImplementation((a) => +a)
})

describe('Account-Controller', () => {
  let controller: AccountController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>
  let validator: Mock<Validator>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()
    validator = mockValidator()

    controller = new AccountController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus,
      validator as Validator
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

    it('1. test', async () => {
      const result = controller.create(request)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.string).toBeCalledWith('email')
      expect(validator.string).toBeCalledWith('password')
      expect(validator.string).toBeCalledWith('nickname')
    })
  })

  describe('2. login TEST', () => {
    let request: Request
    let command: LoginCommand

    beforeEach(() => {
      request = {
        body: {
          email: 'email',
          password: 'password'
        }
      } as Request

      command = new LoginCommand('email', 'password')

      commandBus.execute.mockResolvedValue('result')
    })

    it('1. test', async () => {
      const result = controller.login(request)

      await expect(result).resolves.toBe('result')
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.string).toBeCalledWith('email')
      expect(validator.string).toBeCalledWith('password')
    })
  })

  describe('3. logout TEST', () => {
    let request: Request
    let command: LogoutCommand
    let account: IAccount

    beforeEach(() => {
      account = {} as IAccount
      request = {
        user: account
      } as unknown as Request

      command = new LogoutCommand(account)
    })

    it('1. test', async () => {
      const result = controller.logout(request)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
    })
  })

  describe('4. update TEST', () => {
    let request: Request
    let account: IAccount
    let command: UpdateAccountCommand

    beforeEach(() => {
      account = {} as IAccount
      request = {
        user: account,
        body: {
          nickname: 'nickname',
          password: 'password'
        }
      } as unknown as Request

      command = new UpdateAccountCommand(account, 'nickname', 'password')
    })

    it('1. test', async () => {
      const result = controller.update(request)

      await expect(result).resolves.toBeUndefined()
      expect(commandBus.execute).toBeCalledWith(command)
      expect(validator.stringOptional).toBeCalledWith('nickname')
      expect(validator.stringOptional).toBeCalledWith('password')
    })
  })

  describe('5. refresh TEST', () => {
    let request: Request
    let command: RefreshTokenCommand
    let account: IAccount

    beforeEach(() => {
      account = {} as IAccount
      request = {
        user: account
      } as unknown as Request

      command = new RefreshTokenCommand(account)
      commandBus.execute.mockResolvedValue('token')
    })

    it('1. test', async () => {
      const result = controller.refresh(request)

      await expect(result).resolves.toEqual('token')
      expect(commandBus.execute).toBeCalledWith(command)
    })
  })

  describe('6. findProfile TEST', () => {
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

    it('1. test', async () => {
      const result = controller.findProfile(request)

      await expect(result).resolves.toEqual('result')
      expect(queryBus.execute).toBeCalledWith(query)
      expect(validator.numberPipe).toBeCalledWith('123')
    })
  })
})
