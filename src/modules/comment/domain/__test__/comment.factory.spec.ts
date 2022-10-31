import { Comment, IComment, ICommentProperties } from '../comment'
import { CommentFactory } from '../comment.factory'

describe('Comment-Factory', () => {
  let factory: CommentFactory

  beforeEach(() => {
    factory = new CommentFactory()
  })

  describe('1. create TEST', () => {
    let comment: IComment

    beforeEach(() => {
      comment = new Comment({ account_id: 1, article_id: 2, content: 'content' })
    })

    it('test', () => {
      const result = factory.create(1, 2, 'content')
      expect(result).toEqual(comment)
    })
  })

  describe('2. reconstitute TEST', () => {
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

    it('test', () => {
      const result = factory.reconstitute(properties)
      expect(result).toEqual(comment)
    })
  })
})
