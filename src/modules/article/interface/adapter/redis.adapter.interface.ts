export interface IRedisAdapter {
  lookupExists: (account_id: number, article_id: number) => Promise<boolean>
  setLookup: (account_id: number, article_id: number) => Promise<void>
}
