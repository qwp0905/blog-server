import { AccountOrigin } from '../../../@types/account'
import { Account, IAccount, IAccountProperties } from './account'

export class AccountFactory {
  create(
    email: string,
    password: string,
    nickname: string,
    origin?: AccountOrigin
  ): IAccount {
    return new Account({ email, nickname, password, origin })
  }

  reconstitute(properties: IAccountProperties): IAccount {
    return new Account(properties)
  }
}
