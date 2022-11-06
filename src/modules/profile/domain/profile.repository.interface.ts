import { IProfile } from './profile'

export interface IProfileRepository {
  updateOne(profile: IProfile): Promise<void>
  findOneByAccountId(account_id: number): Promise<IProfile>
}
