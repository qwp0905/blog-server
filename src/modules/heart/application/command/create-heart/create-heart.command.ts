import { ICommand } from '../../../../../shared/interfaces/command'

export interface ICreateHeartCommand {
  readonly account_id: number
  readonly article_id: number
}

export const CREATE_HEART = 'create-heart'

export class CreateHeartCommand implements ICommand {
  readonly key = CREATE_HEART
  readonly context: ICreateHeartCommand

  constructor(account_id: number, article_id: number) {
    this.context = { account_id, article_id }
  }
}
