import { ICommand } from '../../../../../shared/interfaces/command'

export interface IDeleteArticleCommand {
  readonly account_id: number
  readonly article_id: number
}

export const DELETE_ARTICLE = 'delete-article'

export class DeleteArticleCommand implements ICommand {
  readonly key = DELETE_ARTICLE
  readonly context: IDeleteArticleCommand

  constructor(account_id: number, article_id: number) {
    this.context = { article_id, account_id }
  }
}
