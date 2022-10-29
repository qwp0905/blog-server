import { ICommand } from '../../../../../shared/interfaces/command'

export interface IUpdateCommentCommand {
  readonly account_id: number
  readonly comment_id: number
  readonly content: string
}

export const UPDATE_COMMENT = 'update-comment'

export class UpdateCommentCommand implements ICommand {
  readonly key = UPDATE_COMMENT
  readonly context: IUpdateCommentCommand

  constructor(account_id: number, comment_id: number, content: string) {
    this.context = { account_id, comment_id, content }
  }
}
