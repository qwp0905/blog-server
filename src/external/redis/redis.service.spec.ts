import Redis from 'ioredis'
import { Mock } from '../../@types/test'
import { RedisService } from './redis.service'

const mockRedis = (): Mock<Redis> => ({
  setex: jest.fn(),
  get: jest.fn(),
  del: jest.fn()
})

describe('External-Redis', () => {
  let service: RedisService
  let redisCache: Mock<Redis>

  beforeEach(() => {
    redisCache = mockRedis()

    service = new RedisService(redisCache as unknown as Redis)
  })

  it('1. setCache TEST', async () => {
    const result = service.setCache('key', 'value', 123123)

    await expect(result).resolves.toBeUndefined()
    expect(redisCache.setex).toBeCalledWith('key', 123123, 'value')
  })

  it('2. getCache TEST', async () => {
    redisCache.get.mockResolvedValue('value')

    const result = service.getCache('key')

    await expect(result).resolves.toEqual('value')
    expect(redisCache.get).toBeCalledWith('key')
  })

  it('3. deleteCache TEST', async () => {
    const result = service.deleteCache('key')
    await expect(result).resolves.toBeUndefined()
    expect(redisCache.del).toBeCalledWith('key')
  })
})
