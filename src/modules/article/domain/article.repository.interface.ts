import { IArticle } from './article'

export interface IArticleRepository {
  findOneById: (id: number, account_id: number) => Promise<IArticle>
  updateOne: (article: IArticle) => Promise<void>
  insertOne: (article: IArticle) => Promise<void>
  deleteOne: (article: IArticle) => Promise<void>
  updateViewsById: (id: number) => Promise<void>
}
