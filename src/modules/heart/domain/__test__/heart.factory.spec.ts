import { Heart, IHeart, IHeartProperties } from '../heart'
import { HeartFactory } from '../heart.factory'

describe('Heart-Factory', () => {
  let factory: HeartFactory

  beforeEach(() => {
    factory = new HeartFactory()
  })

  describe('1. create TEST', () => {
    let heart: IHeart

    beforeEach(() => {
      heart = new Heart({ article_id: 456, account_id: 123 })
    })

    it('1. test', () => {
      expect(factory.create(123, 456)).toEqual(heart)
    })
  })

  describe('2. reconstitute TEST', () => {
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

    it('1. test', () => {
      expect(factory.reconstitute(properties)).toEqual(heart)
    })
  })
})
