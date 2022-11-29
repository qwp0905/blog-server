import { IArticle } from './article'

export interface IArticleRepository {
  findOneByIds: (id: number, account_id: number) => Promise<IArticle>
  findOneByArticleId: (id: number) => Promise<IArticle>
  updateOne: (article: IArticle) => Promise<void>
  insertOne: (article: IArticle) => Promise<void>
  deleteOne: (article: IArticle) => Promise<void>
  updateViewsById: (id: number) => Promise<void>
}
