import { ICommand, ICommandHandler, ICommandResult } from '../interfaces/command'
import { IQuery, IQueryHandler, IQueryResult } from '../interfaces/query'

export class CommandBus {
  private handlers: Map<string, ICommandHandler> = new Map()

  registerHandlers(handlers: ICommandHandler[]) {
    handlers.forEach((handler) => {
      if (this.handlers.has(handler.key)) {
        throw new Error('duplicate key')
      }
      this.handlers.set(handler.key, handler)
    })
    console.log('Command Handlers registered')
  }

  async execute<T extends ICommand, TResult extends ICommandResult = any>(
    command: T
  ): Promise<TResult> {
    const handler = this.handlers.get(command.key)
    if (!handler) {
      throw new Error('register handler')
    }

    return await handler.execute(command.context)
  }
}

export class QueryBus {
  private handlers: Map<string, IQueryHandler> = new Map()

  registerHandlers(handlers: IQueryHandler[]) {
    handlers.forEach((handler) => {
      if (this.handlers.has(handler.key)) {
        throw new Error('duplicate key')
      }
      this.handlers.set(handler.key, handler)
    })
    console.log('Query Handlers registered')
  }

  async execute<T extends IQuery, TResult extends IQueryResult = any>(
    query: T
  ): Promise<TResult> {
    const handler = this.handlers.get(query.key)
    if (!handler) {
      throw new Error('register handler')
    }

    return await handler.execute(query.context)
  }
}
