import { FindArticleDetailResult } from '../../application/query/find-detail/find-article-detail.query'

export class FindArticleDetailResponse implements FindArticleDetailResult {
  id: number
  account_id: number
  title: string
  views: number
  heart: number
  comments: number
  content: string
  created_at: Date
  updated_at: Date
  tags: string[]
}
