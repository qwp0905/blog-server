import { FindCommentResult } from '../../application/query/find-comment.query'

export class FindCommentsDto {
  article_id?: string
  page?: string
}

export class FindCommentsResponse implements FindCommentResult {
  id: number
  account_id: number
  nickname: string
  content: string
  created_at: Date
  updated_at: Date
}
