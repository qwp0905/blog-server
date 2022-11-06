import { ICommand } from '../../../../shared/interfaces/command'

export interface IUpdateProfileCommand {
  account_id: number
  content: string
}

export const UPDATE_PROFILE = 'update-profile'

export class UpdateProfileCommand implements ICommand {
  readonly key = UPDATE_PROFILE
  readonly context: IUpdateProfileCommand

  constructor(account_id: number, content: string) {
    this.context = { account_id, content }
  }
}
