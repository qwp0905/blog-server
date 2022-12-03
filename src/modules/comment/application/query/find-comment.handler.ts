import { DataSource } from 'typeorm'
import { PAGE_LIMIT } from '../../../../shared/constants/article'
import { ICommandHandler } from '../../../../shared/interfaces/command'
import { AccountEntity } from '../../../account/infrastructure/entities/account.entity'
import { CommentEntity } from '../../infrastructure/entities/comment.entity'
import {
  FindCommentQuery,
  FindCommentResult,
  FIND_COMMENT,
  IFindCommentQuery
} from './find-comment.query'

export class FindCommentHandler
  implements ICommandHandler<FindCommentQuery, FindCommentResult[]>
{
  readonly key = FIND_COMMENT
  constructor(private readonly dataSource: DataSource) {}

  async execute({ article_id, page }: IFindCommentQuery): Promise<FindCommentResult[]> {
    const offset = (page - 1) * PAGE_LIMIT

    return await this.dataSource
      .createQueryBuilder()
      .select('A.id', 'id')
      .addSelect('A.account_id', 'account_id')
      .addSelect('B.nickname', 'nickname')
      .addSelect('A.content', 'content')
      .addSelect('A.created_at', 'created_at')
      .addSelect('A.updated_at', 'updated_at')
      .from(CommentEntity, 'A')
      .innerJoin(AccountEntity, 'B', 'B.id = A.account_id')
      .where('A.article_id = :article_id', { article_id })
      .orderBy('A.created_at', 'DESC')
      .limit(PAGE_LIMIT + 1)
      .offset(offset)
      .execute()
  }
}
