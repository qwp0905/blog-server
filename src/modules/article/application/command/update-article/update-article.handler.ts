import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Container } from '../../../../../shared/lib/container'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import {
  ARTICLE_REPOSITORY,
  IArticleRepository
} from '../../../domain/article.repository.interface'
import {
  IRedisAdapter,
  REDIS_ADAPTER
} from '../../../interface/adapters/redis.adapter.interface'
import {
  IUpdateArticleCommand,
  UpdateArticleCommand,
  UPDATE_ARTICLE
} from './update-article.command'

export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  readonly key = UPDATE_ARTICLE
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly redisAdapter: IRedisAdapter
  ) {}

  async execute({
    account_id,
    article_id,
    title,
    content,
    tags
  }: IUpdateArticleCommand): Promise<void> {
    const article = await this.articleRepository.findOneByIds(article_id, account_id)

    if (!article) {
      throw new Http404Exception('게시물을 찾을 수 없습니다.')
    }

    article.update(title, content, tags)

    await this.articleRepository.updateOne(article)
    await this.redisAdapter.refreshTags()
  }
}
Container.register(UpdateArticleHandler, [ARTICLE_REPOSITORY, REDIS_ADAPTER])
