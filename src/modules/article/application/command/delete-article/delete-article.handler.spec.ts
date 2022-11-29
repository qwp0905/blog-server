import { Mock } from '../../../../../@types/test'
import { IArticle } from '../../../domain/article'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapters/redis.adapter.interface'
import { DeleteArticleCommand, IDeleteArticleCommand } from './delete-article.command'
import { DeleteArticleHandler } from './delete-article.handler'

const mockArticleRepository = (): Mock<IArticleRepository> => ({
  findOneByIds: jest.fn(),
  deleteOne: jest.fn()
})

const mockArticle = (): Mock<IArticle> => ({})

const mockRedisAdapter = (): Mock<IRedisAdapter> => ({
  refreshTags: jest.fn()
})

describe('Article-DeleteArticle', () => {
  let handler: DeleteArticleHandler
  let articleRepository: Mock<IArticleRepository>
  let redisAdapter: Mock<IRedisAdapter>

  beforeEach(() => {
    articleRepository = mockArticleRepository()
    redisAdapter = mockRedisAdapter()

    handler = new DeleteArticleHandler(
      articleRepository as IArticleRepository,
      redisAdapter as IRedisAdapter
    )
  })

  describe('TEST', () => {
    let command: IDeleteArticleCommand
    let article: Mock<IArticle>

    beforeEach(() => {
      command = new DeleteArticleCommand(123, 456).context

      article = mockArticle()
      articleRepository.findOneByIds.mockResolvedValue(article)
    })

    it('1. 게시물이 없는 경우 삭제 불가', async () => {
      articleRepository.findOneByIds.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(articleRepository.findOneByIds).toBeCalledWith(456, 123)
      expect(articleRepository.deleteOne).not.toBeCalled()
    })

    it('2. 정상 삭제', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.findOneByIds).toBeCalledWith(456, 123)
      expect(articleRepository.deleteOne).toBeCalledWith(article)
    })
  })
})
