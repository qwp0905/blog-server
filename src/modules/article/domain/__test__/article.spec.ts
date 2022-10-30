import { Article, IArticle, IArticleProperties } from '../article'

describe('Article-Article', () => {
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

  describe('1. properties TEST', () => {
    it('1. test', () => {
      const result = article.properties()
      expect(result).toEqual(properties)
    })
  })

  describe('2. update TEST', () => {
    it('1. 빈값에 대해 테스트', () => {
      const result = article.update(undefined, undefined, undefined)
      expect(result).toBeUndefined()
      expect(article).toHaveProperty('title', 'title')
      expect(article).toHaveProperty('content', 'content')
      expect(article).toHaveProperty('tags', ['tag1', 'tag2'])
    })

    it('2. 입력 받은 값이 존재하는 경우', () => {
      const result = article.update('new_title', 'new_content', ['new_tag'])
      expect(result).toBeUndefined()
      expect(article).toHaveProperty('title', 'new_title')
      expect(article).toHaveProperty('content', 'new_content')
      expect(article).toHaveProperty('tags', ['new_tag'])
    })
  })
})
