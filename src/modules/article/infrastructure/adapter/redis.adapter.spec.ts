import { Mock } from '../../../../@types/test'
import { RedisService } from '../../../../external/redis/redis.service'
import { IRedisAdapter } from '../../interface/adapter/redis.adapter.interface'
import { RedisAdapter } from './redis.adapter'

const mockRedisService = () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
})

describe('Article-RedisAdapter', () => {
  let adapter: IRedisAdapter
  let redisService: Mock<RedisService>

  beforeEach(() => {
    redisService = mockRedisService()

    adapter = new RedisAdapter(redisService as unknown as RedisService)
  })

  describe('1. lookupExists TEST', () => {
    it('test', async () => {
      redisService.getCache.mockResolvedValue(true)

      const result = adapter.lookupExists(123, 456)
      await expect(result).resolves.toBe(true)
      expect(redisService.getCache).toBeCalledWith(`123-456`)
    })
  })

  describe('2. setLookup TEST', () => {
    it('test', async () => {
      const result = adapter.setLookup(123, 456)
      await expect(result).resolves.toBeUndefined()
      expect(redisService.setCache).toBeCalledWith('123-456', true, 1000 * 60 * 60 * 24)
    })
  })
})
