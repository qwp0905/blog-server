import { Request } from 'express'
import { Mock } from '../../../@types/test'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { ValidationPipe } from '../../../shared/lib/validation-pipe'
import { CreateAccountCommand } from '../application/command/create-account/create-account.command'
import { LoginCommand } from '../application/command/login/login.command'
import { LogoutCommand } from '../application/command/logout/logout.command'
import { RefreshTokenCommand } from '../application/command/refresh-token/refresh-token.command'
import { UpdateAccountCommand } from '../application/command/update-account/update-account.command'
import { IAccount } from '../domain/account'
import { AccountController } from './account.controller'

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
  string: jest.fn().mockImplementation((a) => a),
  stringOptional: jest.fn().mockImplementation((a) => a),
  numberPipe: jest.fn().mockImplementation((a) => +a)
})

describe('Account-Controller', () => {
  let controller: AccountController
  let commandBus: Mock<CommandBus>
  let queryBus: Mock<QueryBus>
  let validationPipe: Mock<ValidationPipe>

  beforeEach(() => {
    commandBus = mockCommandBus()
    queryBus = mockQueryBus()
    validationPipe = mockValidationPipe()

    controller = new AccountController(
      commandBus as unknown as CommandBus,
      queryBus as unknown as QueryBus,
      validationPipe as ValidationPipe
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
      expect(validationPipe.string).toBeCalledWith('email')
      expect(validationPipe.string).toBeCalledWith('password')
      expect(validationPipe.string).toBeCalledWith('nickname')
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
      expect(validationPipe.string).toBeCalledWith('email')
      expect(validationPipe.string).toBeCalledWith('password')
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
      expect(validationPipe.stringOptional).toBeCalledWith('nickname')
      expect(validationPipe.stringOptional).toBeCalledWith('password')
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
})
