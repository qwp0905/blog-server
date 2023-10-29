import { RedisOptions } from 'ioredis'

export const RedisCacheConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  db: 1
}

export const RedisLockConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  db: 2
}

export const RedisSubConfig: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  db: 15
}
