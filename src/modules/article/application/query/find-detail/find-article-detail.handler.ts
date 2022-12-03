import { DataSource } from 'typeorm'
import { IQueryHandler } from '../../../../../shared/interfaces/query'
import { CommentEntity } from '../../../../comment/infrastructure/entities/comment.entity'
import { HeartEntity } from '../../../../heart/infrastructure/entities/heart.entity'
import { ArticleTagMapEntity } from '../../../infrastructure/entities/article-tag-map.entity'
import { ArticleEntity } from '../../../infrastructure/entities/article.entity'
import { TagEntity } from '../../../infrastructure/entities/tag.entity'
import {
  FindArticleDetailQuery,
  FindArticleDetailResult,
  FIND_ARTICLE_DETAIL,
  IFindArticleDetailQuery
} from './find-article-detail.query'

export class FindArticleDetailHandler
  implements IQueryHandler<FindArticleDetailQuery, FindArticleDetailResult>
{
  readonly key = FIND_ARTICLE_DETAIL
  constructor(private readonly dataSource: DataSource) {}

  async execute({
    article_id
  }: IFindArticleDetailQuery): Promise<FindArticleDetailResult> {
    return await this.dataSource
      .createQueryBuilder()
      .select('A.id', 'id')
      .addSelect('A.account_id', 'account_id')
      .addSelect('A.title', 'title')
      .addSelect('A.content', 'content')
      .addSelect('A.views', 'views')
      .addSelect('A.created_at', 'created_at')
      .addSelect('A.updated_at', 'updated_at')
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('ARRAY_AGG(C.tag_name)')
            .from(ArticleTagMapEntity, 'B')
            .innerJoin(TagEntity, 'C', 'C.id = B.tag_id')
            .where('A.id = B.article_id'),
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
      .where('A.id = :article_id', { article_id })
      .groupBy('A.id')
      .getRawOne()
  }
}
