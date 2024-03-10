import { DataSource } from 'typeorm'
import { PAGE_LIMIT } from '../../../../../shared/constants/article'
import { IQueryHandler } from '../../../../../shared/interfaces/query'
import { CommentEntity } from '../../../../comment/infrastructure/entities/comment.entity'
import { HeartEntity } from '../../../../heart/infrastructure/entities/heart.entity'
import { ArticleTagMapEntity } from '../../../infrastructure/entities/article-tag-map.entity'
import { ArticleEntity } from '../../../infrastructure/entities/article.entity'
import { TagEntity } from '../../../infrastructure/entities/tag.entity'
import {
  FindArticleAllQuery,
  FindArticleAllResult,
  FIND_ARTICLE_ALL,
  IFindArticleAllQuery
} from './find-article-all.query'
import { Container } from '../../../../../shared/lib/container'
import { POSTGRES_DB } from '../../../../../config/typeorm.config'

export class FindArticleAllHandler
  implements IQueryHandler<FindArticleAllQuery, FindArticleAllResult[]>
{
  readonly key = FIND_ARTICLE_ALL
  constructor(private readonly dataSource: DataSource) {}

  async execute({
    page,
    tag,
    account_id
  }: IFindArticleAllQuery): Promise<FindArticleAllResult[]> {
    const offset = (page - 1) * PAGE_LIMIT

    return await this.dataSource
      .createQueryBuilder()
      .select('A.id', 'id')
      .addSelect('A.account_id', 'account_id')
      .addSelect('A.title', 'title')
      .addSelect('A.views', 'views')
      .addSelect('A.created_at', 'created_at')
      .addSelect('A.updated_at', 'updated_at')
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('ARRAY_AGG(D.tag_name)')
            .from(TagEntity, 'D')
            .innerJoin(ArticleTagMapEntity, 'E', 'E.tag_id = D.id')
            .where('A.id = E.article_id'),
        'tags'
      )
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('CAST(COUNT(id) AS INTEGER)')
            .from(HeartEntity, 'heart')
            .where('article_id = A.id'),
        'heart'
      )
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('CAST(COUNT(id) AS INTEGER)')
            .from(CommentEntity, 'comment')
            .where('article_id = A.id'),
        'comments'
      )
      .from(ArticleEntity, 'A')
      .innerJoin(ArticleTagMapEntity, 'B', 'A.id = B.article_id')
      .innerJoin(TagEntity, 'C', 'C.id = B.tag_id')
      .where((tag && 'C.tag_name = :tag') || '1 = 1', { tag })
      .andWhere((account_id && 'A.account_id = :account_id') || '1 = 1', {
        account_id
      })
      .groupBy('A.id')
      .orderBy('A.created_at', 'DESC')
      .limit(PAGE_LIMIT + 1)
      .offset(offset)
      .execute()
  }
}
Container.register(FindArticleAllHandler, [POSTGRES_DB])
