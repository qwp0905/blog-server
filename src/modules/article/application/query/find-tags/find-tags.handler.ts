import { DataSource } from 'typeorm'
import { IQueryHandler } from '../../../../../shared/interfaces/query'
import { ArticleTagMapEntity } from '../../../infrastructure/entities/article-tag-map.entity'
import { ArticleEntity } from '../../../infrastructure/entities/article.entity'
import { TagEntity } from '../../../infrastructure/entities/tag.entity'
import { IRedisAdapter } from '../../../interface/adapter/redis.adapter.interface'
import {
  FindTagsQuery,
  FindTagsResult,
  FIND_TAGS,
  IFindTagsQuery
} from './find-tags.query'

export class FindTagsHandler implements IQueryHandler<FindTagsQuery, FindTagsResult[]> {
  readonly key = FIND_TAGS
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisAdapter: IRedisAdapter
  ) {}

  async execute({ account_id }: IFindTagsQuery): Promise<FindTagsResult[]> {
    const cache = await this.redisAdapter.getTags()
    if (cache) {
      return cache
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .select('C.tag_name', 'tag_name')
      .addSelect('CAST(COUNT(C.id) AS INTEGER)', 'quantity')
      .from(ArticleEntity, 'A')
      .innerJoin(ArticleTagMapEntity, 'B', 'A.id = B.article_id')
      .innerJoin(TagEntity, 'C', 'C.id = B.tag_id')
      .where((account_id && `A.account_id = :account_id`) || `1 = 1`, {
        account_id
      })
      .groupBy('C.tag_name')
      .orderBy('quantity', 'DESC')
      .execute()

    const total = await this.dataSource
      .createQueryBuilder()
      .select(`'전체'`, 'tag_name')
      .addSelect('CAST(COUNT(A.id) AS INTEGER)', 'quantity')
      .from(ArticleEntity, 'A')
      .where((account_id && `A.account_id = :account_id`) || `1 = 1`, {
        account_id
      })
      .getRawOne()

    await this.redisAdapter.setTags([total, ...result])

    return [total, ...result]
  }
}
