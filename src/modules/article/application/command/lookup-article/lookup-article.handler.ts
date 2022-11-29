import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapters/redis.adapter.interface'
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
