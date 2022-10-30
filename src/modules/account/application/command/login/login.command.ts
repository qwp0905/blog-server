import { ICommand, ICommandResult } from '../../../../../shared/interfaces/command'

export interface ILoginCommand {
  readonly email: string
  readonly password: string
}

export const LOGIN = 'login'

export class LoginCommand implements ICommand {
  readonly key = LOGIN
  readonly context: ILoginCommand
  constructor(email: string, password: string) {
    this.context = { email, password }
  }
}

export class LoginResult implements ICommandResult {
  id: number
  email: string
  nickname: string
  introduction: string
  created_at: Date
  access_token: string
  refresh_token: string
}
