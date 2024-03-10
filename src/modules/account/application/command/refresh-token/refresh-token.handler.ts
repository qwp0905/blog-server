import { GenerateTokenCommand } from '../../../../../auth/command/generate-token.command'
import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { CommandBus } from '../../../../../shared/lib/bus'
import { Container } from '../../../../../shared/lib/container'
import {
  IRefreshTokenCommand,
  RefreshTokenCommand,
  REFRESH_TOKEN
} from './refresh-token.command'

export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand, string> {
  readonly key = REFRESH_TOKEN
  constructor(private readonly commandBus: CommandBus) {}

  async execute({ account }: IRefreshTokenCommand): Promise<string> {
    const { id, email } = account.properties()

    const command = new GenerateTokenCommand(id, email)
    const access_token = await this.commandBus.execute(command)
    return access_token
  }
}
Container.register(RefreshTokenHandler, [CommandBus])
