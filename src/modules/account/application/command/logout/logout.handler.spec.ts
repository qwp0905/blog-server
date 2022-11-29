import { Mock } from '../../../../../@types/test'
import { IAccount } from '../../../domain/account'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { ILogoutCommand, LogoutCommand } from './logout.command'
import { LogoutHandler } from './logout.handler'

const mockAccountRepository = (): Mock<IAccountRepository> => ({
  updateOne: jest.fn()
})

const mockAccount = (): Mock<IAccount> => ({
  logout: jest.fn()
})

describe('Account-LogoutCommand', () => {
  let handler: LogoutHandler
  let accountRepository: Mock<IAccountRepository>

  beforeEach(() => {
    accountRepository = mockAccountRepository()
    handler = new LogoutHandler(accountRepository as IAccountRepository)
  })

  describe('TEST', () => {
    let command: ILogoutCommand
    let account: Mock<IAccount>

    beforeEach(() => {
      account = mockAccount()

      command = new LogoutCommand(account as IAccount).context
    })

    it('1. test', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(account.logout).toBeCalled()
      expect(accountRepository.updateOne).toBeCalledWith(account)
    })
  })
})
