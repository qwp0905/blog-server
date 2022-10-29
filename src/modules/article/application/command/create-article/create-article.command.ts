import { ICommand } from '../../../../../shared/interfaces/command'

export interface ICreateArticleCommand {
  readonly account_id: number
  readonly title: string
  readonly content: string
  readonly tags: string[]
}

export const CREATE_ARTICLE = 'create-article'

export class CreateArticleCommand implements ICommand {
  readonly key = CREATE_ARTICLE
  readonly context: ICreateArticleCommand

  constructor(account_id: number, title: string, content: string, tags: string[]) {
    this.context = { account_id, title, content, tags }
  }
}
