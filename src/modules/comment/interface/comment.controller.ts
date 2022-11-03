import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { Validator } from '../../../shared/lib/validator'
import { CreateCommentCommand } from '../application/command/create-comment/create-comment.command'
import { DeleteCommentCommand } from '../application/command/delete-comment/delete-comment.command'
import { UpdateCommentCommand } from '../application/command/update-comment/update-comment.command'
import { FindCommentQuery } from '../application/query/find-comment.query'
import { CreateCommentDto } from './dto/create-comment.dto'
import { FindCommentsDto, FindCommentsResponse } from './dto/find-comments.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

export class CommentController implements IController {
  readonly path = '/comment'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {
    const router = Router()

    router
      .get('/', Wrap(this.find))
      .post('/', Auth({ key: 'id' }), Wrap(this.create))
      .patch('/:id', Auth({ key: 'id' }), Wrap(this.update))
      .delete('/:id', Auth({ key: 'id' }), Wrap(this.delete))

    this.router.use(this.path, router)
  }

  find: Handler = async (req): Promise<FindCommentsResponse[]> => {
    const { article_id, page }: FindCommentsDto = req.query

    const query = new FindCommentQuery(
      this.validator.numberPipe(article_id),
      this.validator.numberOptionalPipe(page)
    )
    return await this.queryBus.execute(query)
  }

  create: Handler = async (req) => {
    const { article_id, content }: CreateCommentDto = req.body
    const account_id = req.user as number

    const command = new CreateCommentCommand(
      account_id,
      this.validator.number(article_id),
      this.validator.string(content)
    )
    await this.commandBus.execute(command)
  }

  delete: Handler = async (req) => {
    const comment_id = req.params.id
    const account_id = req.user as number

    const command = new DeleteCommentCommand(
      account_id,
      this.validator.numberPipe(comment_id)
    )
    await this.commandBus.execute(command)
  }

  update: Handler = async (req) => {
    const { content }: UpdateCommentDto = req.body
    const comment_id = req.params.id
    const account_id = req.user as number

    const command = new UpdateCommentCommand(
      account_id,
      this.validator.numberPipe(comment_id),
      this.validator.string(content)
    )
    await this.commandBus.execute(command)
  }
}
