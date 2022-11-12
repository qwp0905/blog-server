import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { ArticleFactory } from '../../../domain/article.factory'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapter/redis.adapter.interface'
import {
  CreateArticleCommand,
  CREATE_ARTICLE,
  ICreateArticleCommand
} from './create-article.command'

export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  readonly key = CREATE_ARTICLE
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly articleFactory: ArticleFactory,
    private readonly redisAdapter: IRedisAdapter
  ) {}

  async execute({
    account_id,
    content,
    title,
    tags
  }: ICreateArticleCommand): Promise<void> {
    const article = this.articleFactory.create(account_id, title, content, tags)

    await this.articleRepository.insertOne(article)
    await this.redisAdapter.refreshTags()
  }
}
