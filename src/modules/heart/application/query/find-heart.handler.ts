import { DataSource } from 'typeorm'
import { IQueryHandler } from '../../../../shared/interfaces/query'
import { HeartEntity } from '../../infrastructure/entities/heart.entity'
import { FindHeartQuery, FIND_HEART, IFindHeartQuery } from './find-heart.query'

export class FindHeartHandler implements IQueryHandler<FindHeartQuery, boolean> {
  readonly key = FIND_HEART
  constructor(private readonly dataSource: DataSource) {}

  async execute({ account_id, article_id }: IFindHeartQuery): Promise<boolean> {
    const heart = await this.dataSource
      .createQueryBuilder()
      .select('id')
      .from(HeartEntity, 'heart')
      .where('account_id = :account_id', { account_id })
      .andWhere('article_id = :article_id', { article_id })
      .getRawOne()

    return !!heart
  }
}
