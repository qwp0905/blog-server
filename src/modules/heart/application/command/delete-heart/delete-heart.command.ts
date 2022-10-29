import { ICommand } from '../../../../../shared/interfaces/command'

export interface IDeleteHeartCommand {
  readonly account_id: number
  readonly article_id: number
}

export const DELETE_HEART = 'delete-heart'

export class DeleteHeartCommand implements ICommand {
  readonly key = DELETE_HEART
  readonly context: IDeleteHeartCommand

  constructor(account_id: number, article_id: number) {
    this.context = { account_id, article_id }
  }
}
