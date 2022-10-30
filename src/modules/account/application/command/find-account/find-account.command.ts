import { ICommand } from '../../../../../shared/interfaces/command'

export interface IFindAccountCommand {
  readonly id: number
}

export const FIND_ACCOUNT = 'find-account'

export class FindAccountCommand implements ICommand {
  readonly key = FIND_ACCOUNT
  readonly context: IFindAccountCommand

  constructor(id: number) {
    this.context = { id }
  }
}
