import { Account, IAccount, IAccountProperties } from '../account'
import { AccountFactory } from '../account.factory'

describe('Account-Factory', () => {
  let factory: AccountFactory

  beforeEach(() => {
    factory = new AccountFactory()
  })

  describe('1. create TEST', () => {
    let account: IAccount

    beforeEach(() => {
      account = new Account({
        email: 'email',
        password: 'password',
        nickname: 'nickname'
      })
    })

    it('1. test', () => {
      const result = factory.create('email', 'password', 'nickname')
      expect(result).toEqual(account)
    })
  })

  describe('2. reconstitute TEST', () => {
    let properties: IAccountProperties
    let account: IAccount
    let date: Date

    beforeEach(() => {
      date = new Date()
      properties = {
        id: 123123,
        email: 'email@email.com',
        nickname: 'nickname',
        role: 'admin',
        introduction: 'introduction',
        password: 'hashed_password',
        created_at: date,
        updated_at: date,
        refresh_token: null
      }

      account = new Account(properties)
    })

    it('1. test', () => {
      const result = factory.reconstitute(properties)
      expect(result).toEqual(account)
    })
  })
})
