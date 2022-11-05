import { DataSource } from 'typeorm'
import { IAccount } from '../../domain/account'
import { AccountFactory } from '../../domain/account.factory'
import { IAccountRepository } from '../../domain/account.repository.interface'
import { AccountEntity } from '../entities/account.entity'

export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountFactory: AccountFactory
  ) {}

  async findOneById(id: number): Promise<IAccount> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(AccountEntity, 'account')
      .where('id = :id', { id })
      .getRawOne()
    return this.entityToModel(entity)
  }

  async findOneByEmail(email: string): Promise<IAccount> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(AccountEntity, 'account')
      .where('email = :email', { email })
      .getRawOne()
    return this.entityToModel(entity)
  }

  async findOneByNickname(nickname: string): Promise<IAccount> {
    const entity = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(AccountEntity, 'account')
      .where('nickname = :nickname', { nickname })
      .getRawOne()
    return this.entityToModel(entity)
  }

  async updateOne(account: IAccount): Promise<void> {
    const { id, password, role, refresh_token, nickname } = account.properties()

    await this.dataSource
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ password, role, refresh_token, nickname })
      .where('id = :id', { id })
      .execute()
  }

  async insertOne(account: IAccount): Promise<void> {
    const { email, nickname, password, role } = account.properties()

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(AccountEntity)
      .values({ email, nickname, password, role })
      .execute()
  }

  private entityToModel(entity: AccountEntity) {
    return entity && this.accountFactory.reconstitute(entity)
  }
}
