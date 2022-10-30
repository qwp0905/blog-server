import { ICommand } from '../../../../../shared/interfaces/command'
import { IAccount } from '../../../domain/account'

export interface IRefreshTokenCommand {
  readonly account: IAccount
}

export const REFRESH_TOKEN = 'refresh-token'

export class RefreshTokenCommand implements ICommand {
  readonly key = REFRESH_TOKEN
  readonly context: IRefreshTokenCommand

  constructor(account: IAccount) {
    this.context = { account }
  }
}
