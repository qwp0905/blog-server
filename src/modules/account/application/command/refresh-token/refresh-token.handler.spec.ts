import { Mock } from '../../../../../@types/test'
import { GenerateTokenCommand } from '../../../../../auth/command/generate-token.command'
import { CommandBus } from '../../../../../shared/lib/bus'
import { IAccount, IAccountProperties } from '../../../domain/account'
import { IRefreshTokenCommand, RefreshTokenCommand } from './refresh-token.command'
import { RefreshTokenHandler } from './refresh-token.handler'

const mockCommandBus = () => ({
  execute: jest.fn()
})

const mockAccount = () => ({
  properties: jest.fn()
})

describe('Account-RefreshToken', () => {
  let handler: RefreshTokenHandler
  let commandBus: Mock<CommandBus>

  beforeEach(() => {
    commandBus = mockCommandBus()

    handler = new RefreshTokenHandler(commandBus as unknown as CommandBus)
  })

  describe('TEST', () => {
    let command: IRefreshTokenCommand
    let command_result: string
    let account: Mock<IAccount>
    let account_properties: IAccountProperties
    let access_token_command: GenerateTokenCommand

    beforeEach(() => {
      account = mockAccount()

      command = new RefreshTokenCommand(account as IAccount).context
      command_result = 'new_access_token'

      account_properties = {
        id: 123123,
        email: 'email@email.com',
        nickname: 'nickname',
        role: 'admin',
        password: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
        refresh_token: null
      }
      account.properties.mockReturnValue(account_properties)

      access_token_command = new GenerateTokenCommand(123123, 'email@email.com')

      commandBus.execute.mockResolvedValue('new_access_token')
    })

    it('1. test', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBe(command_result)
      expect(commandBus.execute).toBeCalledWith(access_token_command)
    })
  })
})
