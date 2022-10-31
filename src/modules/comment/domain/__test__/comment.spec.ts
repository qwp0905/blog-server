import { Comment, IComment, ICommentProperties } from '../comment'

describe('Comment-Comment', () => {
  let comment: IComment
  let properties: ICommentProperties
  const date = new Date()

  beforeEach(() => {
    properties = {
      id: 1,
      account_id: 2,
      article_id: 3,
      content: 'content',
      created_at: date,
      updated_at: date
    }

    comment = new Comment(properties)
  })

  describe('1. properties TEST', () => {
    it('test', () => {
      const result = comment.properties()
      expect(result).toEqual(properties)
    })
  })

  describe('2. update TEST', () => {
    it('test', () => {
      const result = comment.update('new_content')
      expect(result).toBeUndefined()
      expect(comment).toHaveProperty('content', 'new_content')
    })
  })
})
