import { FindArticleAllResult } from '../../application/query/find-article-all/find-article-all.query'

export class FindArticleDto {
  page?: string
  id?: string
  tag?: string
}
export class FindArticleResponse implements FindArticleAllResult {
  id: number
  account_id: number
  title: string
  views: number
  heart: number
  comments: number
  created_at: Date
  updated_at: Date
  tags: string[]
}
