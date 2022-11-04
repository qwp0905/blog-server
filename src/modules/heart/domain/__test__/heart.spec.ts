import { Heart, IHeart, IHeartProperties } from '../heart'

describe('Heart-Heart', () => {
  let heart: IHeart
  let properties: IHeartProperties
  const date = new Date()

  beforeEach(() => {
    properties = {
      id: 111,
      account_id: 123,
      article_id: 456,
      created_at: date
    }
    heart = new Heart(properties)
  })

  it('1. properties TEST', () => {
    expect(heart.properties()).toEqual(properties)
  })
})
