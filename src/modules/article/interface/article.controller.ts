import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Http400Exception } from '../../../shared/lib/http.exception'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { CreateArticleCommand } from '../application/command/create-article/create-article.command'
import { DeleteArticleCommand } from '../application/command/delete-article/delete-article.command'
import { LookupArticleCommand } from '../application/command/lookup-article/lookup-article.command'
import { UpdateArticleCommand } from '../application/command/update-artlcie/update-article.command'
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
    private readonly queryBus: QueryBus
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

  private find: Handler = async (req): Promise<FindArticleResponse[]> => {
    const { page, id, tag }: FindArticleDto = req.query
    if (page && isNaN(+page)) {
      throw new Http400Exception('page는 number 타입이어야 합니다.')
    }

    if (id && isNaN(+id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    if (tag && typeof tag !== 'string') {
      throw new Http400Exception('tag는 string 타입이어야 합니다.')
    }

    const query = new FindArticleAllQuery(+page, tag, +id)
    return await this.queryBus.execute(query)
  }

  private findDetail: Handler = async (req): Promise<FindArticleDetailResponse> => {
    const article_id = +req.params.id
    if (isNaN(article_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const query = new FindArticleDetailQuery(article_id)
    return await this.queryBus.execute(query)
  }

  private findTags: Handler = async (req) => {
    const { id: account_id } = req.query
    if (account_id && isNaN(+account_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const query = new FindTagsQuery(+account_id)
    return await this.queryBus.execute(query)
  }

  private lookup: Handler = async (req): Promise<void> => {
    const article_id = +req.params.id
    const account_id = req.user as number

    if (isNaN(article_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const command = new LookupArticleCommand(article_id, account_id)
    await this.commandBus.execute(command)
  }

  private create: Handler = async (req): Promise<void> => {
    const { title, content, tags }: CreateArticleDto = req.body
    const account_id = req.user as number

    if (!title || typeof title !== 'string') {
      throw new Http400Exception('title은 string 타입이어야합니다.')
    }

    if (!content || typeof content !== 'string') {
      throw new Http400Exception('content는 string 타입이어야합니다.')
    }

    if (!tags || !Array.isArray(tags) || !tags.length || tags.length > 5) {
      throw new Http400Exception('tags는 array 타입이어야합니다.')
    }

    tags.forEach((tag) => {
      if (typeof tag !== 'string') {
        throw new Http400Exception('tag는 string 타입이어야합니다.')
      }
    })

    const command = new CreateArticleCommand(account_id, title, content, tags)
    await this.commandBus.execute(command)
  }

  private update: Handler = async (req) => {
    const article_id = +req.params.id
    const { title, content, tags }: UpdateArticleDto = req.body
    const account_id = req.user as number

    if (isNaN(article_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    if (title && typeof title !== 'string') {
      throw new Http400Exception('title은 string 타입이어야합니다.')
    }

    if (content && typeof content !== 'string') {
      throw new Http400Exception('content는 string 타입이어야합니다.')
    }

    if (tags) {
      if (!Array.isArray(tags) || !tags.length || tags.length > 5) {
        throw new Http400Exception('tags는 array 타입이어야합니다.')
      }

      tags.forEach((tag) => {
        if (typeof tag !== 'string') {
          throw new Http400Exception('tag는 string 타입이어야합니다.')
        }
      })
    }

    const command = new UpdateArticleCommand(account_id, article_id, title, content, tags)
    await this.commandBus.execute(command)
  }

  private delete: Handler = async (req) => {
    const article_id = +req.params.id
    const account_id = req.user as number

    if (isNaN(article_id)) {
      throw new Http400Exception('id는 number 타입이어야 합니다.')
    }

    const command = new DeleteArticleCommand(account_id, article_id)
    await this.commandBus.execute(command)
  }
}
