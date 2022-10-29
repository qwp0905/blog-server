import { ICommand } from '../../../../../shared/interfaces/command'

export interface ILookupArticleCommand {
  article_id: number
  account_id: number
}

export const LOOKUP_ARTICLE = 'lookup-article'

export class LookupArticleCommand implements ICommand {
  readonly key = LOOKUP_ARTICLE
  readonly context: ILookupArticleCommand

  constructor(article_id: number, account_id: number) {
    this.context = { article_id, account_id }
  }
}
