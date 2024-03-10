import { Callback, Result, Redis } from 'ioredis'
import { Time } from '../../shared/lib/time'
import { Container } from '../../shared/lib/container'
import { REDIS_CACHE, REDIS_LOCK, REDIS_SUB } from '../../config/redis.config'

const acquireScript = `
if redis.call("SET", KEYS[1], ARGV[1], "NX", "PX", ARGV[2]) then
	return -2
else
	return redis.call("PTTL", KEYS[1])
end
`

const releaseScript = `
if redis.call("GET", KEYS[1]) ~= ARGV[1] then
	return 0
elseif redis.call("DEL", KEYS[1]) == 1 then
	return redis.call("PUBLISH", KEYS[1], 1)
else
	return 0
end
`

declare module 'ioredis' {
  interface RedisCommander<Context> {
    acquire(
      key: string,
      val: string,
      pttl: number,
      callback?: Callback<number>
    ): Result<number, Context>
    release(
      key: string,
      val: string,
      callback?: Callback<number>
    ): Result<number, Context>
  }
}

function genValue(): string {
  return Buffer.from(Date.now().toString()).toString('base64')
}

export class RedisService {
  constructor(
    private readonly redisCache: Redis,
    private readonly redisLock: Redis,
    private readonly redisSub: Redis
  ) {
    this.redisLock.defineCommand('acquire', {
      lua: acquireScript,
      numberOfKeys: 1
    })
    this.redisLock.defineCommand('release', {
      lua: releaseScript,
      numberOfKeys: 1
    })
    this.redisSub.setMaxListeners(Number.MAX_SAFE_INTEGER)
  }

  async setCache(key: string, value: any, ttl: number) {
    await this.redisCache.setex(key, ttl, value)
  }

  async getCache(key: string) {
    return await this.redisCache.get(key)
  }

  async deleteCache(key: string) {
    await this.redisCache.del(key)
  }

  async lock(key: string, timeout = Time.minute(), retry = -1) {
    const current = genValue()
    await this.redisSub.subscribe(key)
    for (let i = 0; i < retry || retry === -1; i++) {
      const pttl = await this.redisLock.acquire(key, current, timeout)
      if (pttl === -2) {
        return new Locker(this.redisLock, key, current)
      }
      await Promise.race([
        new Promise((resolve) => setTimeout(resolve, pttl - 1)),
        new Promise((resolve) => this.redisSub.once('message', resolve))
      ])
    }
  }
}

class Locker {
  constructor(
    private readonly redisLock: Redis,
    private readonly key: string,
    private readonly value: string
  ) {}

  unlock() {
    return this.redisLock.release(this.key, this.value)
  }
}
Container.register(RedisService, [REDIS_CACHE, REDIS_LOCK, REDIS_SUB])
