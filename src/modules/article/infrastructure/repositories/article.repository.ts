import { DataSource, QueryRunner } from 'typeorm'
import { IArticle, IArticleProperties } from '../../domain/article'
import { ArticleFactory } from '../../domain/article.factory'
import { IArticleRepository } from '../../domain/article.repository.interface'
import { ArticleTagMapEntity } from '../entities/article-tag-map.entity'
import { ArticleEntity } from '../entities/article.entity'
import { TagEntity } from '../entities/tag.entity'

export const ARTICLE_REPOSITORY = 'article_repository'

export class ArticleRepository implements IArticleRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly articleFactory: ArticleFactory
  ) {}

  async findOneByIds(id: number, account_id: number): Promise<IArticle> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('A.id', 'id')
      .addSelect('A.title', 'title')
      .addSelect('A.content', 'content')
      .addSelect('A.views', 'views')
      .addSelect('A.updated_at', 'updated_at')
      .addSelect('A.created_at', 'created_at')
      .addSelect(
        (queryBuilder) =>
          queryBuilder
            .select('ARRAY_AGG(C.tag_name)')
            .from(ArticleTagMapEntity, 'B')
            .innerJoin(TagEntity, 'C', 'C.id = B.tag_id')
            .where('A.id = B.article_id'),
        'tags'
      )
      .from(ArticleEntity, 'A')
      .where('A.id = :id', { id })
      .andWhere('A.account_id = :account_id', { account_id })
      .groupBy('A.id')
      .getRawOne()
    return this.entityToModel(entity)
  }

  async findOneByArticleId(id: number): Promise<IArticle> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(ArticleEntity, 'article')
      .where('id = :id', { id })
      .getRawOne()
    return this.entityToModel(entity)
  }

  async updateOne(article: IArticle) {
    const { id, title, content, tags } = article.properties()

    const query_runner = this.dataSource.createQueryRunner()

    try {
      await query_runner.connect()
      await query_runner.startTransaction()

      await this.dataSource
        .createQueryBuilder(query_runner)
        .update(ArticleEntity)
        .set({ content, title })
        .where('id = :id', { id })
        .execute()

      await this.dataSource
        .createQueryBuilder(query_runner)
        .delete()
        .from(ArticleTagMapEntity)
        .where('article_id = :id', { id })
        .execute()

      for (const tag of tags) {
        const tag_id = await this.findOrCreateTag(tag, query_runner)

        await this.dataSource
          .createQueryBuilder(query_runner)
          .insert()
          .into(ArticleTagMapEntity)
          .values({ article_id: id, tag_id })
          .execute()
      }
      await query_runner.commitTransaction()
      await query_runner.release()
    } catch (err) {
      await query_runner.rollbackTransaction()
      await query_runner.release()
      throw err
    }
  }

  async insertOne(article: IArticle): Promise<void> {
    const { account_id, title, content, tags } = article.properties()

    const query_runner = this.dataSource.createQueryRunner()
    try {
      await query_runner.connect()
      await query_runner.startTransaction()

      const { id } = (
        await this.dataSource
          .createQueryBuilder(query_runner)
          .insert()
          .into(ArticleEntity)
          .values({ account_id, title, content })
          .returning(['id'])
          .execute()
      ).raw[0]

      for (const tag of tags) {
        const tag_id = await this.findOrCreateTag(tag, query_runner)

        await this.dataSource
          .createQueryBuilder(query_runner)
          .insert()
          .into(ArticleTagMapEntity)
          .values({ article_id: id, tag_id })
          .execute()
      }

      await query_runner.commitTransaction()
      await query_runner.release()
    } catch (err) {
      await query_runner.rollbackTransaction()
      await query_runner.release()
      throw err
    }
  }

  private async findOrCreateTag(tag: string, query_runner: QueryRunner): Promise<number> {
    return (
      (
        await this.dataSource
          .createQueryBuilder()
          .select('id')
          .from(TagEntity, 'tag')
          .where('tag_name = :tag', { tag })
          .getRawOne()
      )?.id ||
      (
        await this.dataSource
          .createQueryBuilder(query_runner)
          .insert()
          .into(TagEntity)
          .values({ tag_name: tag })
          .returning(['id'])
          .execute()
      ).raw[0]?.id
    )
  }

  async deleteOne(article: IArticle): Promise<void> {
    const { id } = article.properties()
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ArticleEntity)
      .where('id = :id', { id })
      .execute()
  }

  async updateViewsById(id: number): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(ArticleEntity)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute()
  }

  private entityToModel(entity: IArticleProperties) {
    return entity && this.articleFactory.reconstitute(entity)
  }
}
