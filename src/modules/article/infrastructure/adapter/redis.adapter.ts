import { RedisService } from '../../../../external/redis/redis.service'
import { FindTagsResult } from '../../application/query/find-tags/find-tags.query'
import { IRedisAdapter } from '../../interface/adapter/redis.adapter.interface'

const TAG_KEY = 'TAG_KEY'

export class RedisAdapter implements IRedisAdapter {
  constructor(private readonly redisService: RedisService) {}

  async lookupExists(account_id: number, article_id: number): Promise<boolean> {
    const is_exists = await this.redisService.getCache(`${account_id}-${article_id}`)
    return !!is_exists
  }

  async setLookup(account_id: number, article_id: number): Promise<void> {
    await this.redisService.setCache(
      `${account_id}-${article_id}`,
      true,
      1000 * 60 * 60 * 24
    )
  }

  async setTags(tags: FindTagsResult[]): Promise<void> {
    await this.redisService.setCache(TAG_KEY, JSON.stringify(tags), 1000 * 60 * 60 * 24)
  }

  async getTags(): Promise<FindTagsResult[] | undefined> {
    const cache = await this.redisService.getCache(TAG_KEY)

    return cache && JSON.parse(cache)
  }

  async refreshTags(): Promise<void> {
    await this.redisService.deleteCache(TAG_KEY)
  }
}
