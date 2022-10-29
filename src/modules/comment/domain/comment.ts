export interface ICommentEssentialProperties {
  account_id: number
  article_id: number
  content: string
}

export interface ICommentOptionalProperties {
  id?: number
  created_at?: Date
  updated_at?: Date
}

export interface ICommentProperties
  extends ICommentEssentialProperties,
    Required<ICommentOptionalProperties> {}

export interface IComment {
  properties: () => ICommentProperties
  update: (content: string) => void
}

export class Comment implements IComment {
  private id: number
  private account_id: number
  private article_id: number
  private content: string
  private created_at: Date
  private updated_at: Date

  constructor(properties: ICommentEssentialProperties & ICommentOptionalProperties) {
    Object.assign(this, properties)
  }

  update(content: string) {
    this.content = content
  }

  properties() {
    return {
      id: this.id,
      account_id: this.account_id,
      article_id: this.article_id,
      content: this.content,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
