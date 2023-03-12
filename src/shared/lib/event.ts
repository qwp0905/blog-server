import * as EventEmitter from 'events'

export interface IEvent {
  readonly key: string
  readonly context: unknown
}

export interface IEventHandler<Event extends IEvent = any> {
  readonly key: Event['key']
  handle(event: Event['context']): void | Promise<void>
}

export class EventBus {
  private handlers: Map<string, IEventHandler> = new Map()
  private eventEmitter = new EventEmitter()

  constructor() {
    this.eventEmitter.addListener('emit', ({ key, context }: IEvent) => {
      const handler = this.handlers.get(key)

      if (!handler) {
        throw new Error('register handler')
      }

      handler.handle(context)
    })
  }

  registerHandlers(handlers: IEventHandler[]) {
    handlers.forEach((handler) => {
      if (this.handlers.has(handler.key)) {
        throw new Error('duplicate key')
      }
      this.handlers.set(handler.key, handler)
    })
    console.log('Event Handlers Registered')
  }

  handle(event: IEvent) {
    this.eventEmitter.emit('emit', event)
  }
}
