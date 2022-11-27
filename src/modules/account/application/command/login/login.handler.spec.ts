import { Mock } from '../../../../../@types/test'
import { GenerateTokenCommand } from '../../../../../auth/command/generate-token.command'
import { CommandBus } from '../../../../../shared/lib/bus'
import { IAccount, IAccountProperties } from '../../../domain/account'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { ILoginCommand, LoginCommand, LoginResult } from './login.command'
import { LoginHandler } from './login.handler'

const mockAccountRepository = () => ({
  findOneByEmail: jest.fn(),
  updateOne: jest.fn()
})

const mockCommandBus = () => ({
  execute: jest.fn()
})

const mockAccount = () => ({
  comparePassword: jest.fn(),
  properties: jest.fn(),
  login: jest.fn()
})

describe('Account-Login', () => {
  let handler: LoginHandler
  let accountRepository: Mock<IAccountRepository>
  let commandBus: Mock<CommandBus>

  beforeEach(() => {
    accountRepository = mockAccountRepository()
    commandBus = mockCommandBus()

    handler = new LoginHandler(
      accountRepository as IAccountRepository,
      commandBus as unknown as CommandBus
    )
  })

  describe('TEST', () => {
    let command: ILoginCommand
    let account: Mock<IAccount>
    let account_properties: IAccountProperties
    let command_result: LoginResult
    let created_at: Date

    const access_token_command: GenerateTokenCommand = new GenerateTokenCommand(
      123123,
      'email@email.com'
    )
    const refresh_token_command: GenerateTokenCommand = new GenerateTokenCommand(
      123123,
      'email@email.com',
      '12h'
    )

    beforeEach(() => {
      created_at = new Date()
      command = new LoginCommand('email@email.com', 'password').context

      command_result = {
        id: 123123,
        email: 'email@email.com',
        nickname: 'nickname',
        role: 'admin',
        origin: 'local',
        created_at,
        access_token: 'access_token',
        refresh_token: 'refresh_token'
      }

      account = mockAccount()
      account_properties = {
        id: 123123,
        origin: 'local',
        email: 'email@email.com',
        nickname: 'nickname',
        role: 'admin',
        password: 'hashed_password',
        created_at,
        updated_at: new Date(),
        refresh_token: null
      }
      account.properties.mockReturnValue(account_properties)

      accountRepository.findOneByEmail.mockResolvedValue(account)

      commandBus.execute.mockReturnValueOnce('access_token')
      commandBus.execute.mockReturnValue('refresh_token')
    })

    it('1. 유저가 존재하지 않으면 로그인 실패', async () => {
      accountRepository.findOneByEmail.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(accountRepository.findOneByEmail).toBeCalledWith('email@email.com')
      expect(account.comparePassword).not.toBeCalled()
    })

    it('2. 정상 로그인', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toEqual(command_result)
      expect(accountRepository.findOneByEmail).toBeCalledWith('email@email.com')
      expect(account.comparePassword).toBeCalledWith('password')

      expect(commandBus.execute).toHaveBeenNthCalledWith(1, access_token_command)
      expect(commandBus.execute).toHaveBeenNthCalledWith(2, refresh_token_command)

      expect(account.login).toBeCalledWith('refresh_token')
      expect(accountRepository.updateOne).toBeCalledWith(account)
    })
  })
})
