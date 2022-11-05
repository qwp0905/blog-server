import { Mock } from '../../../../../@types/test'
import { IAccount } from '../../../domain/account'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { IUpdateAccountCommand, UpdateAccountCommand } from './update-account.command'
import { UpdateAccountHandler } from './update-account.handler'

const mockAccountRepository = () => ({
  findOneByNickname: jest.fn(),
  updateOne: jest.fn()
})

const mockAccount = () => ({
  update: jest.fn()
})

describe('Account-UpdateAccount', () => {
  let handler: UpdateAccountHandler
  let accountRepository: Mock<IAccountRepository>

  beforeEach(() => {
    accountRepository = mockAccountRepository()

    handler = new UpdateAccountHandler(accountRepository as IAccountRepository)
  })

  describe('TEST', () => {
    let command: IUpdateAccountCommand
    let account: Mock<IAccount>

    beforeEach(() => {
      account = mockAccount()
      command = new UpdateAccountCommand(account as IAccount, 'nickname', 'password')
        .context
    })

    it('1. 닉네임이 변경되지 않는 경우', async () => {
      command = {
        account: account as IAccount
      }

      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(accountRepository.findOneByNickname).not.toBeCalled()
      expect(account.update).toBeCalledWith(undefined, undefined)
      expect(accountRepository.updateOne).toBeCalledWith(account)
    })

    it('2. 닉네임이 중복되는 경우', async () => {
      accountRepository.findOneByNickname.mockResolvedValueOnce(mockAccount())

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(account.update).not.toBeCalled()
      expect(accountRepository.updateOne).not.toBeCalled()
    })

    it('3. 닉네임도 변경하는 경우', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toBeUndefined()
      expect(accountRepository.findOneByNickname).toBeCalledWith('nickname')
      expect(account.update).toBeCalledWith('nickname', 'password')
      expect(accountRepository.updateOne).toBeCalledWith(account)
    })
  })
})
