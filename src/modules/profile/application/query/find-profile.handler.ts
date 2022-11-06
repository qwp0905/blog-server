import { DataSource } from 'typeorm'
import { IQueryHandler } from '../../../../shared/interfaces/query'
import { ProfileEntity } from '../../infrastructure/entities/profile.entity'
import { FindProfileQuery, FindProfileResult, FIND_PROFILE } from './find-profile.query'

export class FindProfileHandler
  implements IQueryHandler<FindProfileQuery, FindProfileResult>
{
  readonly key = FIND_PROFILE
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<FindProfileResult> {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('content')
      .from(ProfileEntity, 'profile')
      .where('id = 1')
      .getRawOne()

    return result
  }
}
