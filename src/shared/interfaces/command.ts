export interface ICommand {
  readonly key: string
  readonly context: unknown
}

export interface ICommandResult {}

export interface ICommandHandler<
  Command extends ICommand = any,
  CommandResult extends ICommandResult = any
> {
  readonly key: Command['key']
  execute(command: Command['context']): Promise<CommandResult>
}
