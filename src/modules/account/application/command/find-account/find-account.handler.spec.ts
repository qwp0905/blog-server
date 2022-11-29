import { Mock } from '../../../../../@types/test'
import { IAccount } from '../../../domain/account'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { FindAccountCommand, IFindAccountCommand } from './find-account.command'
import { FindAccountHandler } from './find-account.handler'

const mockAccountRepository = (): Mock<IAccountRepository> => ({
  findOneById: jest.fn()
})

const mockAccount = (): Mock<IAccount> => ({})

describe('Account-FindAccount', () => {
  let handler: FindAccountHandler
  let accountRepository: Mock<IAccountRepository>

  beforeEach(() => {
    accountRepository = mockAccountRepository()

    handler = new FindAccountHandler(accountRepository as IAccountRepository)
  })

  describe('TEST', () => {
    let command: IFindAccountCommand
    let account: Mock<IAccount>

    beforeEach(() => {
      command = new FindAccountCommand(123).context

      account = mockAccount()
      accountRepository.findOneById.mockResolvedValue(account)
    })

    it('1. 없을 경우 에러', async () => {
      accountRepository.findOneById.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(accountRepository.findOneById).toBeCalledWith(123)
    })

    it('2. 있을 경우 account 반환', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBe(account)
      expect(accountRepository.findOneById).toBeCalledWith(123)
    })
  })
})
