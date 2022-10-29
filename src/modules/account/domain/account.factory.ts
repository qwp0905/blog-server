import { Account, IAccount, IAccountProperties } from './account'

export class AccountFactory {
  create(email: string, password: string, nickname: string): IAccount {
    return new Account({ email, nickname, password })
  }

  reconstitute(properties: IAccountProperties): IAccount {
    return new Account(properties)
  }
}
