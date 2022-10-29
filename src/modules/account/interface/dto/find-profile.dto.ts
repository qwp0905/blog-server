import { FindProfileResult } from '../../application/query/find-profile.query'

export class FindProfileResponse implements FindProfileResult {
  id: number
  nickname: string
  introduction: string
  created_at: Date
  articles: number
}
