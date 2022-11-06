import { ICommandHandler } from '../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../shared/lib/http.exception'
import { IProfileRepository } from '../../domain/profile.repository.interface'
import {
  IUpdateProfileCommand,
  UpdateProfileCommand,
  UPDATE_PROFILE
} from './update-profile.command'

export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  readonly key = UPDATE_PROFILE
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute({ account_id, content }: IUpdateProfileCommand): Promise<void> {
    const profile = await this.profileRepository.findOneByAccountId(account_id)

    if (!profile) {
      throw new Http404Exception('계정을 찾을 수 없습니다.')
    }

    profile.update(content)

    await this.profileRepository.updateOne(profile)
  }
}
