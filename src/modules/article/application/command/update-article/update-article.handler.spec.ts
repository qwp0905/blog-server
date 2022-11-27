import { Mock } from '../../../../../@types/test'
import { IArticle } from '../../../domain/article'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapters/redis.adapter.interface'
import { IUpdateArticleCommand, UpdateArticleCommand } from './update-article.command'
import { UpdateArticleHandler } from './update-article.handler'

const mockArticleRepository = () => ({
  findOneById: jest.fn(),
  updateOne: jest.fn()
})

const mockArticle = () => ({
  update: jest.fn()
})

const mockRedisAdapter = () => ({
  refreshTags: jest.fn()
})

describe('Article-UpdateArticle', () => {
  let handler: UpdateArticleHandler
  let articleRepository: Mock<IArticleRepository>
  let redisAdapter: Mock<IRedisAdapter>

  beforeEach(() => {
    articleRepository = mockArticleRepository()
    redisAdapter = mockRedisAdapter()

    handler = new UpdateArticleHandler(
      articleRepository as IArticleRepository,
      redisAdapter as IRedisAdapter
    )
  })

  describe('TEST', () => {
    let command: IUpdateArticleCommand
    let article: Mock<IArticle>

    beforeEach(() => {
      command = new UpdateArticleCommand(123, 456, 'title', 'content', ['tag1', 'tag2'])
        .context

      article = mockArticle()

      articleRepository.findOneById.mockResolvedValue(article)
    })

    it('1. 존재하지 않는 게시물에 대해 에러 반환', async () => {
      articleRepository.findOneById.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(articleRepository.findOneById).toBeCalledWith(456, 123)
      expect(article.update).not.toBeCalled()
      expect(articleRepository.updateOne).not.toBeCalled()
    })

    it('2. 정상 업데이트', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.findOneById).toBeCalledWith(456, 123)
      expect(article.update).toBeCalledWith('title', 'content', ['tag1', 'tag2'])
      expect(articleRepository.updateOne).toBeCalledWith(article)
    })
  })
})
