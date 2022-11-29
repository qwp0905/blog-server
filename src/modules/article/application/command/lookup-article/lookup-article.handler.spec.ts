import { Mock } from '../../../../../@types/test'
import { IArticle } from '../../../domain/article'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapters/redis.adapter.interface'
import { ILookupArticleCommand, LookupArticleCommand } from './lookup-article.command'
import { LookupArticleHandler } from './lookup-article.handler'

const mockArticleRepository = (): Mock<IArticleRepository> => ({
  updateViewsById: jest.fn(),
  findOneByArticleId: jest.fn()
})

const mockRedisAdapter = (): Mock<IRedisAdapter> => ({
  lookupExists: jest.fn(),
  setLookup: jest.fn()
})

const mockArticle = (): Mock<IArticle> => ({})

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
    let article: Mock<IArticle>

    beforeEach(() => {
      command = new LookupArticleCommand(1212, 3434).context
      article = mockArticle()

      articleRepository.findOneByArticleId.mockResolvedValue(article)
      redisAdapter.lookupExists.mockResolvedValue(false)
    })

    it('1. 있는 경우 패스', async () => {
      redisAdapter.lookupExists.mockResolvedValueOnce(true)

      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.findOneByArticleId).toBeCalledWith(1212)
      expect(redisAdapter.lookupExists).toBeCalledWith(3434, 1212)
      expect(articleRepository.updateViewsById).not.toBeCalled()
      expect(redisAdapter.setLookup).not.toBeCalled()
    })

    it('2. 없는 경우 생성', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.findOneByArticleId).toBeCalledWith(1212)
      expect(articleRepository.updateViewsById).toBeCalledWith(1212)
      expect(redisAdapter.setLookup).toBeCalledWith(3434, 1212)
    })

    it('3. 게시물 존재하지 않는 경우 에러 반환', async () => {
      articleRepository.findOneByArticleId.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(articleRepository.findOneByArticleId).toBeCalledWith(1212)
    })
  })
})
