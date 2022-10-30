export interface IQuery {
  readonly key: string
  readonly context: any
}

export interface IQueryResult {}

export interface IQueryHandler<
  Query extends IQuery = any,
  QueryResult extends IQueryResult = any
> {
  readonly key: Query['key']
  execute(query: Query['context']): Promise<QueryResult>
}
