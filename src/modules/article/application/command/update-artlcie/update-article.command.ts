import { ICommand } from '../../../../../shared/interfaces/command'

export interface IUpdateArticleCommand {
  readonly account_id: number
  readonly article_id: number
  readonly title?: string
  readonly content?: string
  readonly tags?: string[]
}

export const UPDATE_ARTICLE = 'update-article'

export class UpdateArticleCommand implements ICommand {
  readonly key = UPDATE_ARTICLE
  readonly context: IUpdateArticleCommand

  constructor(
    account_id: number,
    article_id: number,
    title?: string,
    content?: string,
    tags?: string[]
  ) {
    this.context = { account_id, article_id, title, content, tags }
  }
}
