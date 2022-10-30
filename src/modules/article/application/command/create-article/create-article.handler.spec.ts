import { Mock } from '../../../../../@types/test'
import { IArticle } from '../../../domain/article'
import { ArticleFactory } from '../../../domain/article.factory'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { CreateArticleCommand, ICreateArticleCommand } from './create-article.command'
import { CreateArticleHandler } from './create-article.handler'

const mockArticleRepository = () => ({
  insertOne: jest.fn()
})

const mockArticleFactory = () => ({
  create: jest.fn()
})

const mockArticle = () => ({})

describe('Article-CreateArticle', () => {
  let handler: CreateArticleHandler
  let articleRepository: Mock<IArticleRepository>
  let articleFactory: Mock<ArticleFactory>

  beforeEach(() => {
    articleRepository = mockArticleRepository()
    articleFactory = mockArticleFactory()

    handler = new CreateArticleHandler(
      articleRepository as IArticleRepository,
      articleFactory as ArticleFactory
    )
  })

  describe('TEST', () => {
    let command: ICreateArticleCommand
    let article: Mock<IArticle>

    beforeEach(() => {
      command = new CreateArticleCommand(123123, 'title', 'content', ['tag1', 'tag2'])
        .context

      article = mockArticle()
      articleFactory.create.mockReturnValue(article)
    })

    it('1. test', async () => {
      const result = handler.execute(command)
      await expect(result).resolves.toBeUndefined()
      expect(articleFactory.create).toBeCalledWith(123123, 'title', 'content', [
        'tag1',
        'tag2'
      ])
      expect(articleRepository.insertOne).toBeCalledWith(article)
    })
  })
})
