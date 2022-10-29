import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Http400Exception } from '../../../shared/lib/http.exception'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
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
    private readonly queryBus: QueryBus
  ) {
    const router = Router()

    router
      .get('/', Wrap(this.find))
      .post('/', Auth({ key: 'id' }), Wrap(this.create))
      .patch('/:id', Auth({ key: 'id' }), Wrap(this.update))
      .delete('/:id', Auth({ key: 'id' }), Wrap(this.delete))

    this.router.use(this.path, router)
  }

  private find: Handler = async (req): Promise<FindCommentsResponse> => {
    const { article_id, page }: FindCommentsDto = req.query

    if (isNaN(+article_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    if (page && isNaN(+page)) {
      throw new Http400Exception('page는 number 타입이어야 합니다.')
    }

    const query = new FindCommentQuery(+article_id, +page)
    return await this.queryBus.execute(query)
  }

  private create: Handler = async (req) => {
    const { article_id, content }: CreateCommentDto = req.body
    const account_id = req.user as number

    if (!article_id || typeof article_id !== 'number') {
      throw new Http400Exception('article_id는 number 타입이어야 합니다.')
    }

    if (!content || typeof content !== 'string') {
      throw new Http400Exception('content는 string 타입이어야 합니다.')
    }

    const command = new CreateCommentCommand(account_id, article_id, content)
    await this.commandBus.execute(command)
  }

  private delete: Handler = async (req) => {
    const comment_id = +req.params.id
    const account_id = req.user as number

    if (isNaN(comment_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const command = new DeleteCommentCommand(account_id, comment_id)
    await this.commandBus.execute(command)
  }

  private update: Handler = async (req) => {
    const { content }: UpdateCommentDto = req.body
    const comment_id = +req.params.id
    const account_id = req.user as number

    if (content && typeof content !== 'string') {
      throw new Http400Exception('content는 string 타입이어야 합니다.')
    }

    if (isNaN(comment_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const command = new UpdateCommentCommand(account_id, comment_id, content)
    await this.commandBus.execute(command)
  }
}
