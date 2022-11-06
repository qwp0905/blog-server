import { IQuery, IQueryResult } from '../../../../shared/interfaces/query'

export const FIND_PROFILE = 'find-profile'

export class FindProfileQuery implements IQuery {
  readonly key = FIND_PROFILE
  readonly context = undefined
}

export class FindProfileResult implements IQueryResult {
  content: string
}
