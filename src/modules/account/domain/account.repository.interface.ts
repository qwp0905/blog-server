import { IAccount } from './account'

export const ACCOUNT_REPOSITORY = 'account-repository'
export interface IAccountRepository {
  insertOne(account: IAccount): Promise<void>
  findOneById(id: number): Promise<IAccount | undefined>
  findOneByEmail(email: string): Promise<IAccount | undefined>
  findOneByNickname(nickname: string): Promise<IAccount | undefined>
  updateOne(account: IAccount): Promise<void>
}
