import { RedisOptions } from 'ioredis'

export const RedisCacheConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: 6379,
  db: 1
}
