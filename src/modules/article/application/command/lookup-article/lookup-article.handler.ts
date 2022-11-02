import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapter/redis.adapter.interface'
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
    const is_exists = await this.redisAdapter.lookupExists(account_id, article_id)

    if (!is_exists) {
      await this.articleRepository.updateViewsById(article_id)

      await this.redisAdapter.setLookup(account_id, article_id)
    }
  }
}
