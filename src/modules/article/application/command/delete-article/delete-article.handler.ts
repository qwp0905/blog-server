import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { IArticleRepository } from '../../../domain/article.repository.interface'
import { IRedisAdapter } from '../../../interface/adapters/redis.adapter.interface'
import {
  DeleteArticleCommand,
  DELETE_ARTICLE,
  IDeleteArticleCommand
} from './delete-article.command'

export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  readonly key = DELETE_ARTICLE
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly redisAdapter: IRedisAdapter
  ) {}

  async execute({ article_id, account_id }: IDeleteArticleCommand): Promise<void> {
    const article = await this.articleRepository.findOneByIds(article_id, account_id)

    if (!article) {
      throw new Http404Exception('삭제할 게시물이 없습니다.')
    }

    await this.articleRepository.deleteOne(article)
    await this.redisAdapter.refreshTags()
  }
}
