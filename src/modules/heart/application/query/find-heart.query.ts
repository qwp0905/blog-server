import { IQuery } from '../../../../shared/interfaces/query'

export interface IFindHeartQuery {
  readonly account_id: number
  readonly article_id: number
}

export const FIND_HEART = 'find-heart'

export class FindHeartQuery implements IQuery {
  readonly key = FIND_HEART
  readonly context: IFindHeartQuery

  constructor(account_id: number, article_id: number) {
    this.context = { account_id, article_id }
  }
}
