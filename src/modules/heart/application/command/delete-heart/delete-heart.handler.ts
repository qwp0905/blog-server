import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
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
      throw new Http404Exception('게시물이 없습니다')
    }

    await this.heartRepository.deleteOneById(heart)
  }
}
