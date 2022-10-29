import { IHeart } from './heart'

export interface IHeartRepository {
  findOneByIds: (account_id: number, article_id: number) => Promise<IHeart>
  insertOne: (heart: IHeart) => Promise<void>
  deleteOneById: (heart: IHeart) => Promise<void>
}
