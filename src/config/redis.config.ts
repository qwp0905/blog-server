import { RedisOptions } from 'ioredis'

export const RedisCacheConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  db: 1
}
