import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { Validator } from '../../../shared/lib/validator'
import { CreateArticleCommand } from '../application/command/create-article/create-article.command'
import { DeleteArticleCommand } from '../application/command/delete-article/delete-article.command'
import { LookupArticleCommand } from '../application/command/lookup-article/lookup-article.command'
import { UpdateArticleCommand } from '../application/command/update-article/update-article.command'
import { FindArticleAllQuery } from '../application/query/find-article-all/find-article-all.query'
import { FindArticleDetailQuery } from '../application/query/find-detail/find-article-detail.query'
import { FindTagsQuery } from '../application/query/find-tags/find-tags.query'
import { CreateArticleDto } from './dto/create-article.dto'
import { FindArticleDetailResponse } from './dto/find-article-detail.dto'
import { FindArticleDto, FindArticleResponse } from './dto/find-article.dto'
import { UpdateArticleDto } from './dto/update-artlcie.dto'

export class ArticleController implements IController {
  readonly path = '/article'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {
    const router = Router()

    router
      .get('/', Wrap(this.find))
      .get('/tags', Wrap(this.findTags))
      .get('/:id', Wrap(this.findDetail))
      .post('/', Auth({ key: 'id' }), Wrap(this.create))
      .patch('/:id', Auth({ key: 'id' }), Wrap(this.update))
      .delete('/:id', Auth({ key: 'id' }), Wrap(this.delete))
      .patch('/lookup/:id', Auth({ key: 'id' }), Wrap(this.lookup))

    this.router.use(this.path, router)
  }

  find: Handler = async (req): Promise<FindArticleResponse[]> => {
    const { page, id, tag }: FindArticleDto = req.query

    const query = new FindArticleAllQuery(
      this.validator.numberOptionalPipe(page),
      this.validator.stringOptional(tag),
      this.validator.numberOptionalPipe(id)
    )
    return await this.queryBus.execute(query)
  }

  findDetail: Handler = async (req): Promise<FindArticleDetailResponse> => {
    const article_id = req.params.id

    const query = new FindArticleDetailQuery(this.validator.numberPipe(article_id))
    return await this.queryBus.execute(query)
  }

  findTags: Handler = async (req) => {
    const { id: account_id } = req.query

    const query = new FindTagsQuery(this.validator.numberOptionalPipe(account_id))
    return await this.queryBus.execute(query)
  }

  lookup: Handler = async (req): Promise<void> => {
    const article_id = req.params.id
    const account_id = req.user as number

    const command = new LookupArticleCommand(
      this.validator.numberPipe(article_id),
      account_id
    )
    await this.commandBus.execute(command)
  }

  create: Handler = async (req): Promise<void> => {
    const { title, content, tags }: CreateArticleDto = req.body
    const account_id = req.user as number

    const command = new CreateArticleCommand(
      account_id,
      this.validator.string(title),
      this.validator.string(content),
      this.validator.stringArray(tags, 5)
    )
    await this.commandBus.execute(command)
  }

  update: Handler = async (req) => {
    const article_id = req.params.id
    const { title, content, tags }: UpdateArticleDto = req.body
    const account_id = req.user as number

    const command = new UpdateArticleCommand(
      account_id,
      this.validator.numberPipe(article_id),
      this.validator.string(title),
      this.validator.string(content),
      this.validator.stringArray(tags, 5)
    )
    await this.commandBus.execute(command)
  }

  delete: Handler = async (req) => {
    const article_id = req.params.id
    const account_id = req.user as number

    const command = new DeleteArticleCommand(
      account_id,
      this.validator.numberPipe(article_id)
    )
    await this.commandBus.execute(command)
  }
}
