import { ICommand } from '../../../../../shared/interfaces/command'

export interface ICreateAccountCommand {
  readonly email: string
  readonly password: string
  readonly nickname: string
}

export const CREATE_ACCOUNT = 'create-account'

export class CreateAccountCommand implements ICommand {
  readonly key = CREATE_ACCOUNT
  readonly context: ICreateAccountCommand

  constructor(email: string, password: string, nickname: string) {
    this.context = { email, password, nickname }
  }
}
