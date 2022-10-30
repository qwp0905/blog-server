import { IQuery, IQueryResult } from '../../../../../shared/interfaces/query'

export interface IFindArticleDetailQuery {
  readonly article_id: number
}

export const FIND_ARTICLE_DETAIL = 'find-article-detail'

export class FindArticleDetailQuery implements IQuery {
  readonly key = FIND_ARTICLE_DETAIL
  readonly context: IFindArticleDetailQuery

  constructor(article_id: number) {
    this.context = { article_id }
  }
}

export class FindArticleDetailResult implements IQueryResult {
  id: number
  account_id: number
  nickname: string
  title: string
  views: number
  heart: number
  comments: number
  content: string
  created_at: Date
  updated_at: Date
  tags: string[]
}
