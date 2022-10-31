import { Article, IArticle, IArticleProperties } from '../article'
import { ArticleFactory } from '../article.factory'

describe('Article-Factory', () => {
  let factory: ArticleFactory

  beforeEach(() => {
    factory = new ArticleFactory()
  })

  describe('1. create Test', () => {
    let article: IArticle

    beforeEach(() => {
      article = new Article({
        account_id: 1,
        title: 'title',
        content: 'content',
        tags: ['tag1', 'tag2']
      })
    })

    it('test', () => {
      const result = factory.create(1, 'title', 'content', ['tag1', 'tag2'])
      expect(result).toEqual(article)
    })
  })

  describe('2. reconstitute TEST', () => {
    let article: IArticle
    let properties: IArticleProperties
    const date = new Date()

    beforeEach(() => {
      properties = {
        id: 100,
        account_id: 1,
        title: 'title',
        content: 'content',
        tags: ['tag1', 'tag2'],
        created_at: date,
        updated_at: date,
        views: 10
      }

      article = new Article(properties)
    })

    it('test', () => {
      const result = factory.reconstitute(properties)
      expect(result).toEqual(article)
    })
  })
})
