import { DataSource } from 'typeorm'
import { IQueryHandler } from '../../../../shared/interfaces/query'
import { ArticleEntity } from '../../../article/infrastructure/entities/article.entity'
import {
  FindProfileQuery,
  FindProfileResult,
  FIND_PROFILE,
  IFindProfileQuery
} from './find-profile.query'

export class FindProfileHandler
  implements IQueryHandler<FindProfileQuery, FindProfileResult>
{
  readonly key = FIND_PROFILE
  constructor(private readonly dataSource: DataSource) {}

  async execute({ id }: IFindProfileQuery): Promise<FindProfileResult> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('A.id', 'id')
      .addSelect('A.nickname', 'nickname')
      .addSelect('A.created_at', 'created_at')
      .addSelect('A.introduction', 'introduction')
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('CAST(COUNT(id) AS INTEGER)')
            .from(ArticleEntity, 'article')
            .where('account_id = A.id'),
        'articles'
      )
      .from('account', 'A')
      .where('id = :id', { id })
      .getRawOne()

    return result
  }
}
