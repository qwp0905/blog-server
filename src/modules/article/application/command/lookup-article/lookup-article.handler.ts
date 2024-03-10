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
  ILookupArticleCommand,
  LookupArticleCommand,
  LOOKUP_ARTICLE
} from './lookup-article.command'

export class LookupArticleHandler implements ICommandHandler<LookupArticleCommand> {
  readonly key = LOOKUP_ARTICLE
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly redisAdapter: IRedisAdapter
  ) {}

  async execute({ article_id, account_id }: ILookupArticleCommand): Promise<void> {
    const article = await this.articleRepository.findOneByArticleId(article_id)

    if (!article) {
      throw new Http404Exception('게시물이 존재하지 않습니다.')
    }

    const is_exists = await this.redisAdapter.lookupExists(account_id, article_id)

    if (!is_exists) {
      await this.articleRepository.updateViewsById(article_id)

      await this.redisAdapter.setLookup(account_id, article_id)
    }
  }
}
Container.register(LookupArticleHandler, [ARTICLE_REPOSITORY, REDIS_ADAPTER])
