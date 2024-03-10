import IORedis, { Redis, RedisOptions } from 'ioredis'
import { Provider } from '../shared/lib/container'

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

export const REDIS_CACHE = 'redis-cache'
export const RedisCacheProvider: Provider<Redis> = {
  provide: REDIS_CACHE,
  async useFactory() {
    return new IORedis(RedisCacheConfig)
  }
}

export const REDIS_LOCK = 'redis-lock'
export const RedisLockProvider: Provider<Redis> = {
  provide: REDIS_LOCK,
  async useFactory() {
    return new IORedis(RedisLockConfig)
  }
}

export const REDIS_SUB = 'redis-sub'
export const RedisSubProvider: Provider<Redis> = {
  provide: REDIS_SUB,
  async useFactory() {
    return new IORedis(RedisSubConfig)
  }
}
