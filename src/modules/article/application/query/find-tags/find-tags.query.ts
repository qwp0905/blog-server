import { IQuery } from '../../../../../shared/interfaces/query'

export interface IFindTagsQuery {
  readonly account_id?: number
}

export const FIND_TAGS = 'find-tags'

export class FindTagsQuery implements IQuery {
  readonly key = FIND_TAGS
  readonly context: IFindTagsQuery

  constructor(account_id?: number) {
    this.context = { account_id }
  }
}

export class FindTagsResult {
  tag_name: string
  quantity: number
}
