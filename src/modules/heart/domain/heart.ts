export interface IHeartEssentialProperties {
  account_id: number
  article_id: number
}

export interface IHeartOptionalProperties {
  id?: number
  created_at?: Date
}

export interface IHeartProperties
  extends IHeartEssentialProperties,
    Required<IHeartOptionalProperties> {}

export interface IHeart {
  properties: () => IHeartProperties
}

export class Heart implements IHeart {
  private id: number
  private account_id: number
  private article_id: number
  private created_at: Date

  constructor(properties: IHeartEssentialProperties & IHeartOptionalProperties) {
    Object.assign(this, properties)
  }

  properties() {
    return {
      id: this.id,
      account_id: this.account_id,
      article_id: this.article_id,
      created_at: this.created_at
    }
  }
}
