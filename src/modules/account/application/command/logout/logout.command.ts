import { ICommand } from '../../../../../shared/interfaces/command'
import { IAccount } from '../../../domain/account'

export interface ILogoutCommand {
  account: IAccount
}

export const LOGOUT = 'logout'

export class LogoutCommand implements ICommand {
  readonly key = LOGOUT
  readonly context: ILogoutCommand

  constructor(account: IAccount) {
    this.context = { account }
  }
}
