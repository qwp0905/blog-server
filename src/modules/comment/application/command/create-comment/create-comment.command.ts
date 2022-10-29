import { ICommand } from '../../../../../shared/interfaces/command'

export interface ICreateCommentCommand {
  readonly account_id: number
  readonly article_id: number
  readonly content: string
}

export const CREATE_COMMENT = 'create-comment'

export class CreateCommentCommand implements ICommand {
  readonly key = CREATE_COMMENT
  readonly context: ICreateCommentCommand

  constructor(account_id: number, article_id: number, content: string) {
    this.context = { account_id, article_id, content }
  }
}
