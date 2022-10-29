import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { HeartFactory } from '../../../domain/heart.factory'
import { IHeartRepository } from '../../../domain/heart.repository.interface'
import {
  CreateHeartCommand,
  CREATE_HEART,
  ICreateHeartCommand
} from './create-heart.command'

export class CreateHeartHandler implements ICommandHandler<CreateHeartCommand> {
  readonly key = CREATE_HEART
  constructor(
    private readonly heartRepository: IHeartRepository,
    private readonly heartFactory: HeartFactory
  ) {}

  async execute({ account_id, article_id }: ICreateHeartCommand): Promise<void> {
    const is_exists = await this.heartRepository.findOneByIds(account_id, article_id)

    if (!is_exists) {
      const heart = this.heartFactory.create(account_id, article_id)

      await this.heartRepository.insertOne(heart)
    }
  }
}
