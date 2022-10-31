import { ICommand } from '../../../../shared/interfaces/command'

export interface IFindCommentQuery {
  readonly article_id: number
  readonly page?: number
}

export const FIND_COMMENT = 'find-comment'

export class FindCommentQuery implements ICommand {
  readonly key = FIND_COMMENT
  readonly context: IFindCommentQuery

  constructor(article_id: number, page = 1) {
    this.context = { article_id, page }
  }
}

export class FindCommentResult {
  id: number
  account_id: number
  nickname: string
  content: string
  created_at: Date
  updated_at: Date
}
