import { Heart, IHeart, IHeartProperties } from './heart'

export class HeartFactory {
  create(account_id: number, article_id: number): IHeart {
    return new Heart({ account_id, article_id })
  }

  reconstitute(properties: IHeartProperties) {
    return new Heart(properties)
  }
}
