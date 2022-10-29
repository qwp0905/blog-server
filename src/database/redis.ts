import IORedis from 'ioredis'

export const REDIS_CACHE = new IORedis({
  host: process.env.REDIS_HOST,
  port: 6379,
  db: 1
})
