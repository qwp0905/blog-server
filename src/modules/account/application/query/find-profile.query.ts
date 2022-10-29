import { IQuery, IQueryResult } from '../../../../shared/interfaces/query'

export interface IFindProfileQuery {
  id: number
}

export const FIND_PROFILE = 'find-profile'

export class FindProfileQuery implements IQuery {
  readonly key = FIND_PROFILE
  readonly context: IFindProfileQuery

  constructor(id: number) {
    this.context = { id }
  }
}

export class FindProfileResult implements IQueryResult {
  id: number
  nickname: string
  introduction: string
  created_at: Date
  articles: number
}
