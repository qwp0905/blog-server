import { FindTagsResult } from '../../application/query/find-tags/find-tags.query'

export interface IRedisAdapter {
  lookupExists: (account_id: number, article_id: number) => Promise<boolean>
  setLookup: (account_id: number, article_id: number) => Promise<void>
  setTags: (tags: FindTagsResult[]) => Promise<void>
  getTags: () => Promise<FindTagsResult[] | undefined>
  refreshTags: () => Promise<void>
}
export const REDIS_ADAPTER = 'redis-adapter'
