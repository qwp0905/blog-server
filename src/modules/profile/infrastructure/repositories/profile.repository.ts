import { DataSource } from 'typeorm'
import { IProfile } from '../../domain/profile'
import { ProfileFactory } from '../../domain/profile.factory'
import { IProfileRepository } from '../../domain/profile.repository.interface'
import { ProfileEntity } from '../entities/profile.entity'

export class ProfileRepository implements IProfileRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly profileFactory: ProfileFactory
  ) {}

  async findOneByAccountId(account_id: number): Promise<IProfile> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(ProfileEntity, 'profile')
      .where('account_id = :account_id', { account_id })
      .getRawOne()
    return this.entityToModel(entity)
  }

  async updateOne(profile: IProfile): Promise<void> {
    const { id, content } = profile.properties()

    await this.dataSource
      .createQueryBuilder()
      .update(ProfileEntity)
      .set({ content })
      .where('id = :id', { id })
      .execute()
  }

  private entityToModel(entity: ProfileEntity) {
    return entity && this.profileFactory.reconstitute(entity)
  }
}
