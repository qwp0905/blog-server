import { Mock } from '../../../../../@types/test'
import { IAccount } from '../../../domain/account'
import { AccountFactory } from '../../../domain/account.factory'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { CreateAccountCommand, ICreateAccountCommand } from './create-account.command'
import { CreateAccountHandler } from './create-account.handler'

const mockAccountRepository = (): Mock<IAccountRepository> => ({
  findOneByEmail: jest.fn(),
  findOneByNickname: jest.fn(),
  insertOne: jest.fn()
})

const mockAccountFactory = (): Mock<AccountFactory> => ({
  create: jest.fn()
})

const mockAccount = (): Mock<IAccount> => ({
  hashPassword: jest.fn()
})

describe('Account-CreateAccount', () => {
  let handler: CreateAccountHandler
  let accountRepository: Mock<IAccountRepository>
  let accountFactory: Mock<AccountFactory>

  beforeEach(() => {
    accountRepository = mockAccountRepository()
    accountFactory = mockAccountFactory()

    handler = new CreateAccountHandler(
      accountRepository as IAccountRepository,
      accountFactory as AccountFactory
    )
  })

  describe('TEST', () => {
    let command: ICreateAccountCommand
    let account: Mock<IAccount>
    beforeEach(() => {
      command = new CreateAccountCommand('email@email.com', 'password', 'nickname')
        .context

      account = mockAccount()
      accountFactory.create.mockReturnValue(account)
    })

    it('1. 존재하는 이메일에 대해 409에러', async () => {
      accountRepository.findOneByEmail.mockResolvedValueOnce(mockAccount())

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(accountRepository.findOneByEmail).toBeCalledWith('email@email.com')
      expect(accountRepository.insertOne).not.toBeCalled()
    })

    it('2. 존재하는 닉네임에 대해 409에러', async () => {
      accountRepository.findOneByNickname.mockResolvedValueOnce(mockAccount())

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(accountRepository.findOneByEmail).toBeCalledWith('email@email.com')
      expect(accountRepository.findOneByNickname).toBeCalledWith('nickname')
      expect(accountRepository.insertOne).not.toBeCalled()
    })

    it('3. 정상 생성되고 메서드 호출', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()

      expect(accountRepository.findOneByEmail).toBeCalledWith('email@email.com')
      expect(accountRepository.findOneByNickname).toBeCalledWith('nickname')

      expect(accountFactory.create).toBeCalledWith(
        'email@email.com',
        'password',
        'nickname'
      )

      expect(accountRepository.insertOne).toBeCalledWith(account)
      expect(account.hashPassword).toBeCalled()
    })
  })
})
