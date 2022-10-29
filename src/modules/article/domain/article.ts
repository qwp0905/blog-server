export interface IArticleEssentialProperties {
  account_id: number
  title: string
  content: string
  tags: string[]
}

export interface IArticleOptionalProperties {
  id?: number
  created_at?: Date
  updated_at?: Date
  views?: number
}

export interface IArticleProperties
  extends IArticleEssentialProperties,
    Required<IArticleOptionalProperties> {}

export interface IArticle {
  properties: () => IArticleProperties
  update: (title: string, content: string, tags: string[]) => void
}

export class Article implements IArticle {
  private id: number
  private account_id: number
  private title: string
  private content: string
  private tags: string[]
  private created_at: Date
  private updated_at: Date
  private views: number

  constructor(properties: IArticleEssentialProperties & IArticleOptionalProperties) {
    Object.assign(this, properties)
  }

  update(title?: string, content?: string, tags?: string[]) {
    this.title = title ?? this.title
    this.content = content ?? this.content
    this.tags = tags ?? this.tags
  }

  properties() {
    return {
      id: this.id,
      account_id: this.account_id,
      title: this.title,
      content: this.content,
      views: this.views,
      created_at: this.created_at,
      updated_at: this.updated_at,
      tags: this.tags
    }
  }
}
