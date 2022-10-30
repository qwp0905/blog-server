import { Mock } from '../../../../../@types/test'
import { IArticle } from '../../../domain/article'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { DeleteArticleCommand, IDeleteArticleCommand } from './delete-article.command'
import { DeleteArticleHandler } from './delete-article.handler'

const mockArticleRepository = () => ({
  findOneById: jest.fn(),
  deleteOne: jest.fn()
})

const mockArticle = () => ({})

describe('Article-DeleteArticle', () => {
  let handler: DeleteArticleHandler
  let articleRepository: Mock<IArticleRepository>

  beforeEach(() => {
    articleRepository = mockArticleRepository()

    handler = new DeleteArticleHandler(articleRepository as IArticleRepository)
  })

  describe('TEST', () => {
    let command: IDeleteArticleCommand
    let article: Mock<IArticle>

    beforeEach(() => {
      command = new DeleteArticleCommand(123, 456).context

      article = mockArticle()
      articleRepository.findOneById.mockResolvedValue(article)
    })

    it('1. 게시물이 없는 경우 삭제 불가', async () => {
      articleRepository.findOneById.mockResolvedValueOnce(undefined)

      const result = handler.execute(command)
      await expect(result).rejects.toThrowError()
      expect(articleRepository.findOneById).toBeCalledWith(456, 123)
      expect(articleRepository.deleteOne).not.toBeCalled()
    })

    it('2. 정상 삭제', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleRepository.findOneById).toBeCalledWith(456, 123)
      expect(articleRepository.deleteOne).toBeCalledWith(article)
    })
  })
})
