import { Container } from '../../../shared/lib/container'
import { Article, IArticle, IArticleProperties } from './article'

export class ArticleFactory {
  create(account_id: number, title: string, content: string, tags: string[]): IArticle {
    return new Article({ account_id, title, content, tags })
  }

  reconstitute(properties: IArticleProperties): IArticle {
    return new Article(properties)
  }
}
Container.register(ArticleFactory)
