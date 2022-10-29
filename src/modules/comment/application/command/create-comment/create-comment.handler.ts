import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { CommentFactory } from '../../../domain/comment.factory'
import { ICommentRepository } from '../../../domain/comment.repository.interface'
import {
  CreateCommentCommand,
  CREATE_COMMENT,
  ICreateCommentCommand
} from './create-comment.command'

export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  readonly key = CREATE_COMMENT
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly commentFactory: CommentFactory
  ) {}

  async execute({
    account_id,
    article_id,
    content
  }: ICreateCommentCommand): Promise<void> {
    const comment = this.commentFactory.create(account_id, article_id, content)

    await this.commentRepository.insertOne(comment)
  }
}
