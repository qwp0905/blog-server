import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import {
  DeleteCommentCommand,
  DELETE_COMMENT,
  IDeleteCommentCommand
} from './delete-comment.command'

export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  readonly key = DELETE_COMMENT
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute({ account_id, comment_id }: IDeleteCommentCommand): Promise<void> {
    const comment = await this.commentRepository.findOneById(comment_id, account_id)

    if (!comment) {
      throw new Http404Exception('댓글을 찾을 수 없습니다.')
    }

    await this.commentRepository.deleteOne(comment)
  }
}
