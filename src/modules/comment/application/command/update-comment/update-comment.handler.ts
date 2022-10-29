import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import {
  IUpdateCommentCommand,
  UpdateCommentCommand,
  UPDATE_COMMENT
} from './update-comment.command'

export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  readonly key = UPDATE_COMMENT
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute({
    account_id,
    comment_id,
    content
  }: IUpdateCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findOneById(comment_id, account_id)

    if (!comment) {
      throw new Http404Exception('댓글을 찾을 수 없습니다.')
    }

    comment.update(content)

    await this.commentRepository.updateOne(comment)
  }
}
