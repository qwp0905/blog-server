import { DataSource } from 'typeorm'
import { IComment } from '../../domain/comment'
import { CommentFactory } from '../../domain/comment.factory'
import { ICommentRepository } from '../../domain/comment.repository.interface'
import { CommentEntity } from '../entities/comment.entity'

export class CommentRepository implements ICommentRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly commentFactory: CommentFactory
  ) {}

  async findOneById(id: number, account_id: number): Promise<IComment> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(CommentEntity, 'comment')
      .where('id = :id', { id })
      .andWhere('account_id = :account_id', { account_id })
      .getRawOne()

    return this.entityToModel(entity)
  }

  async insertOne(comment: IComment): Promise<void> {
    const { account_id, article_id, content } = comment.properties()

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values({ account_id, article_id, content })
      .execute()
  }

  async updateOne(comment: IComment): Promise<void> {
    const { id, content } = comment.properties()

    await this.dataSource
      .createQueryBuilder()
      .update(CommentEntity)
      .set({ content })
      .where('id = :id', { id })
      .execute()
  }

  async deleteOne(comment: IComment): Promise<void> {
    const { id } = comment.properties()

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id })
      .execute()
  }

  private entityToModel(entity: CommentEntity) {
    return this.commentFactory.reconstitute(entity)
  }
}
