import { IComment } from './comment'

export interface ICommentRepository {
  findOneById: (id: number, account_id: number) => Promise<IComment>
  insertOne: (comment: IComment) => Promise<void>
  updateOne: (comment: IComment) => Promise<void>
  deleteOne: (comment: IComment) => Promise<void>
}
