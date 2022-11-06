export interface IProfileEssentialProperties {
  account_id: number
  content: string
}

export interface IProfileOptionalProperties {
  id?: number
  created_at?: Date
  updated_at?: Date
}

export interface IProfileProperties
  extends IProfileEssentialProperties,
    Required<IProfileOptionalProperties> {}

export interface IProfile {
  properties(): IProfileProperties
  update(content: string): void
}

export class Profile implements IProfile {
  private id: number
  private account_id: number
  private content: string
  private created_at: Date
  private updated_at: Date

  constructor(properties: IProfileEssentialProperties & IProfileOptionalProperties) {
    Object.assign(this, properties)
  }

  update(content: string): void {
    this.content = content
  }

  properties(): IProfileProperties {
    return {
      id: this.id,
      account_id: this.account_id,
      content: this.content,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
