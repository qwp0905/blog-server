import Redis from 'ioredis'

export class RedisService {
  constructor(private readonly redisCache: Redis) {}

  async setCache(key: string, value: any, ttl: number) {
    await this.redisCache.setex(key, ttl, value)
  }

  async getCache(key: string) {
    return await this.redisCache.get(key)
  }
}
