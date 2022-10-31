import { IQuery, IQueryHandler } from '../../interfaces/query'
import { QueryBus } from '../bus'

describe('Command Bus', () => {
  let bus: QueryBus

  beforeEach(() => {
    bus = new QueryBus()
  })

  describe('1. registerHandlers TEST', () => {
    let handler: IQueryHandler
    let map: Map<string, IQueryHandler>

    beforeEach(() => {
      handler = {
        key: 'key',
        execute: jest.fn()
      }

      map = new Map()
      map.set(handler.key, handler)
    })

    it('1. 등록', () => {
      const result = bus.registerHandlers([handler as IQueryHandler])
      expect(result).toBeUndefined()
      expect(bus).toHaveProperty('handlers', map)
    })

    it('2. 중복', () => {
      const handler2: IQueryHandler = {
        key: 'key',
        execute: jest.fn()
      }

      expect(() => bus.registerHandlers([handler, handler2])).toThrowError()
    })
  })

  describe('2. execute TEST', () => {
    let command: IQuery
    let handler: IQueryHandler

    beforeEach(() => {
      command = { key: 'key', context: 'context' }
      handler = {
        key: 'key',
        execute: jest.fn().mockResolvedValue('result')
      }
    })

    it('1. 에러', async () => {
      const result = bus.execute(command)
      await expect(result).rejects.toThrowError()
    })

    it('2. 실행', async () => {
      bus.registerHandlers([handler])

      const result = bus.execute(command)
      await expect(result).resolves.toBe('result')
      expect(handler.execute).toBeCalledWith('context')
    })
  })
})
