import { ICommand } from '../../../../../shared/interfaces/command'

export interface IDeleteCommentCommand {
  readonly account_id: number
  readonly comment_id: number
}

export const DELETE_COMMENT = 'delete-comment'

export class DeleteCommentCommand implements ICommand {
  readonly key = DELETE_COMMENT
  readonly context: IDeleteCommentCommand

  constructor(account_id: number, comment_id: number) {
    this.context = { account_id, comment_id }
  }
}
