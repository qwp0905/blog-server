export interface IRedisAdapter {
  isExists: (account_id: number, article_id: number) => Promise<boolean>
  set: (account_id: number, article_id: number) => Promise<void>
}
