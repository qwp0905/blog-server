import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { IHeartRepository } from '../../../domain/heart.repository.interface'
import {
  DeleteHeartCommand,
  DELETE_HEART,
  IDeleteHeartCommand
} from './delete-heart.command'

export class DeleteHeartHandler implements ICommandHandler<DeleteHeartCommand> {
  readonly key = DELETE_HEART
  constructor(private readonly heartRepository: IHeartRepository) {}

  async execute({ account_id, article_id }: IDeleteHeartCommand): Promise<void> {
    const heart = await this.heartRepository.findOneByIds(account_id, article_id)

    if (!heart) {
      return
    }

    await this.heartRepository.deleteOne(heart)
  }
}
