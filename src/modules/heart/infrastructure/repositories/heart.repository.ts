import { DataSource } from 'typeorm'
import { IHeart } from '../../domain/heart'
import { HeartFactory } from '../../domain/heart.factory'
import { IHeartRepository } from '../../domain/heart.repository.interface'
import { HeartEntity } from '../entities/heart.entity'
import { Container } from '../../../../shared/lib/container'
import { POSTGRES_DB } from '../../../../config/typeorm.config'

export class HeartRepository implements IHeartRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly heartFactory: HeartFactory
  ) {}

  async findOneByIds(account_id: number, article_id: number): Promise<IHeart> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(HeartEntity, 'heart')
      .where('account_id = :account_id', { account_id })
      .andWhere('article_id = :article_id', { article_id })
      .getRawOne()

    return this.entityToModel(entity)
  }

  async insertOne(heart: IHeart): Promise<void> {
    const { account_id, article_id } = heart.properties()

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(HeartEntity)
      .values({ account_id, article_id })
      .execute()
  }

  async deleteOne(heart: IHeart): Promise<void> {
    const { id } = heart.properties()

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(HeartEntity)
      .where('id = :id', { id })
      .execute()
  }

  private entityToModel(entity: HeartEntity) {
    return entity && this.heartFactory.reconstitute(entity)
  }
}
Container.register(HeartRepository, [POSTGRES_DB, HeartFactory])
// Container.provide({})
