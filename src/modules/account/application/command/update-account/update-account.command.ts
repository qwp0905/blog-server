import { ICommand } from '../../../../../shared/interfaces/command'
import { IAccount } from '../../../domain/account'

export interface IUpdateAccountCommand {
  readonly account: IAccount
  readonly nickname?: string
  readonly password?: string
  readonly introduction?: string
}

export const UPDATE_ACCOUNT = 'update-account'

export class UpdateAccountCommand implements ICommand {
  readonly key = UPDATE_ACCOUNT
  readonly context: IUpdateAccountCommand

  constructor(
    account: IAccount,
    nickname?: string,
    password?: string,
    introduction?: string
  ) {
    this.context = {
      account,
      nickname,
      password,
      introduction
    }
  }
}
