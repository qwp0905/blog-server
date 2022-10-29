import { IQuery } from '../../../../../shared/interfaces/query'

export interface IFindArticleAllQuery {
  page: number
  tag?: string
  account_id?: number
}

export const FIND_ARTICLE_ALL = 'find-article-all'

export class FindArticleAllQuery implements IQuery {
  readonly key = FIND_ARTICLE_ALL
  readonly context: IFindArticleAllQuery
  constructor(page = 1, tag?: string, account_id?: number) {
    this.context = { page, tag, account_id }
  }
}

export class FindArticleAllResult {
  id: number
  account_id: number
  title: string
  views: number
  heart: number
  comments: number
  created_at: Date
  updated_at: Date
  nickname: string
  tags: string[]
}
