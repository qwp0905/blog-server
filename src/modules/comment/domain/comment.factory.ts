import { Comment, IComment, ICommentProperties } from './comment'

export class CommentFactory {
  create(account_id: number, article_id: number, content: string): IComment {
    return new Comment({ account_id, article_id, content })
  }

  reconstitute(properties: ICommentProperties): IComment {
    return new Comment(properties)
  }
}
