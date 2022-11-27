import * as bcrypt from 'bcrypt'
import { Account, IAccount, IAccountProperties } from '../account'

describe('Account-Account', () => {
  let account: IAccount
  let properties: IAccountProperties
  const created_at = new Date()
  const updated_at = new Date()

  beforeEach(() => {
    properties = {
      id: 123123,
      origin: 'local',
      email: 'email@email.com',
      nickname: 'nickname',
      role: 'admin',
      password: 'password',
      created_at,
      updated_at,
      refresh_token: null
    }
    account = new Account(properties)
  })

  describe('1. properties TEST', () => {
    it('1. test', () => {
      const result = account.properties()
      expect(result).toEqual(properties)
    })
  })

  describe('2. comparePassword TEST', () => {
    it('1. 비밀 번호 다른 경우', () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false)

      expect(() => account.comparePassword('login_password')).toThrowError()
      expect(bcrypt.compareSync).toBeCalledWith('login_password', 'password')
    })

    it('2. 비밀 번호 같은 경우', () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true)

      const result = account.comparePassword('login_password')
      expect(result).toBeUndefined()
      expect(bcrypt.compareSync).toBeCalledWith('login_password', 'password')
    })
  })

  describe('3. compareRole TEST', () => {
    it('1. 권한이 없는 경우', () => {
      properties.role = 'guest'
      account = new Account(properties)

      expect(() => account.compareRole('admin')).toThrowError()
    })

    it('2. 권한이 있는 경우', () => {
      expect(account.compareRole('admin')).toBeUndefined()
    })
  })

  describe('4. hashPassword TEST', () => {
    beforeEach(() => {
      jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('salt')
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed_pwd')
    })

    it('1. 현재 비밀번호가 잘못된 경우', () => {
      properties.password = ''
      account = new Account(properties)

      expect(() => account.hashPassword()).toThrowError()
    })

    it('2. 정상 생성', () => {
      const result = account.hashPassword()
      expect(result).toBeUndefined()
      expect(bcrypt.genSaltSync).toBeCalled()
      expect(bcrypt.hashSync).toBeCalledWith('password', 'salt')
      expect(account).toHaveProperty('password', 'hashed_pwd')
    })
  })

  describe('5. login TEST', () => {
    it('1. test', () => {
      const result = account.login('refresh')
      expect(result).toBeUndefined()
      expect(account).toHaveProperty('refresh_token', 'refresh')
    })
  })

  describe('6. logout TEST', () => {
    it('1. test', () => {
      properties.refresh_token = 'refresh'
      account = new Account(properties)

      const result = account.logout()
      expect(result).toBeUndefined()
      expect(account).toHaveProperty('refresh_token', null)
    })
  })

  describe('7. update TEST', () => {
    it('1. password 없는 경우', () => {
      const result = account.update('new_nickname', undefined)
      expect(result).toBeUndefined()
      expect(account).toHaveProperty('password', 'password')
      expect(account).toHaveProperty('nickname', 'new_nickname')
    })

    it('2. password 있는 경우', () => {
      jest.spyOn(account, 'hashPassword')
      jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue('salt')
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed_pwd')

      const result = account.update(undefined, 'new_pwd')
      expect(result).toBeUndefined()
      expect(account).toHaveProperty('password', 'hashed_pwd')
      expect(account).toHaveProperty('nickname', 'nickname')
      expect(account.hashPassword).toBeCalled()
      expect(bcrypt.genSaltSync).toBeCalled()
      expect(bcrypt.hashSync).toBeCalledWith('new_pwd', 'salt')
    })
  })
})
