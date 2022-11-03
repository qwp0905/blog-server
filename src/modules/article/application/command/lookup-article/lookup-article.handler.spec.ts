import { Mock } from '../../../../../@types/test'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapter/redis.adapter.interface'
import { ILookupArticleCommand, LookupArticleCommand } from './lookup-article.command'
import { LookupArticleHandler } from './lookup-article.handler'

const mockArticleRepository = () => ({
  updateViewsById: jest.fn()
})

const mockRedisAdapter = () => ({
  lookupExists: jest.fn(),
  setLookup: jest.fn()
})

describe('Article-LookupArticle', () => {
  let handler: LookupArticleHandler
  let articleRepository: Mock<IArticleRepository>
  let redisAdapter: Mock<IRedisAdapter>

  beforeEach(() => {
    articleRepository = mockArticleRepository()
    redisAdapter = mockRedisAdapter()

    handler = new LookupArticleHandler(
      articleRepository as IArticleRepository,
      redisAdapter as IRedisAdapter
    )
  })

  describe('TEST', () => {
    let command: ILookupArticleCommand

    beforeEach(() => {
      command = new LookupArticleCommand(1212, 3434).context

      redisAdapter.lookupExists.mockResolvedValue(false)
    })

    it('1. 있는 경우 패스', async () => {
      redisAdapter.lookupExists.mockResolvedValueOnce(true)

      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(redisAdapter.lookupExists).toBeCalledWith(3434, 1212)
      expect(articleRepository.updateViewsById).not.toBeCalled()
      expect(redisAdapter.setLookup).not.toBeCalled()
    })

    it('2. 없는 경우 생성', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.updateViewsById).toBeCalledWith(1212)
      expect(redisAdapter.setLookup).toBeCalledWith(3434, 1212)
    })
  })
})
