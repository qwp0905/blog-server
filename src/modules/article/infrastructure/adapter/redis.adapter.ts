import { RedisService } from '../../../../external/redis/redis.service'
import { IRedisAdapter } from '../../interface/adapter/redis.adapter.interface'

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
}
