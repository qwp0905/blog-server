import { ICommand, ICommandHandler } from '../../interfaces/command'
import { CommandBus } from '../bus'

describe('Command Bus', () => {
  let bus: CommandBus

  beforeEach(() => {
    bus = new CommandBus()
  })

  describe('1. registerHandlers TEST', () => {
    let handler: ICommandHandler
    let map: Map<string, ICommandHandler>

    beforeEach(() => {
      handler = {
        key: 'key',
        execute: jest.fn()
      }

      map = new Map()
      map.set(handler.key, handler)
    })

    it('1. 등록', () => {
      const result = bus.registerHandlers([handler as ICommandHandler])
      expect(result).toBeUndefined()
      expect(bus).toHaveProperty('handlers', map)
    })

    it('2. 중복', () => {
      const handler2: ICommandHandler = {
        key: 'key',
        execute: jest.fn()
      }

      expect(() => bus.registerHandlers([handler, handler2])).toThrowError()
    })
  })

  describe('2. execute TEST', () => {
    let command: ICommand
    let handler: ICommandHandler

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
