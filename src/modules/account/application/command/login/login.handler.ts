import { GenerateTokenCommand } from '../../../../../auth/command/generate-token.command'
import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { CommandBus } from '../../../../../shared/lib/bus'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { ILoginCommand, LOGIN, LoginCommand, LoginResult } from './login.command'

export class LoginHandler implements ICommandHandler<LoginCommand, LoginResult> {
  readonly key = LOGIN
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly commandBus: CommandBus
  ) {}

  async execute({ email, password }: ILoginCommand): Promise<LoginResult> {
    const account = await this.accountRepository.findOneByEmail(email)
    if (!account) {
      throw new Http404Exception('로그인 실패')
    }

    account.comparePassword(password)

    const properties = account.properties()

    const access_token_command = new GenerateTokenCommand(properties.id, properties.email)
    const refresh_token_command = new GenerateTokenCommand(
      properties.id,
      properties.email,
      '12h'
    )
    const access_token = await this.commandBus.execute(access_token_command)
    const refresh_token = await this.commandBus.execute(refresh_token_command)

    account.login(refresh_token)

    await this.accountRepository.updateOne(account)

    return {
      id: properties.id,
      email: properties.email,
      nickname: properties.nickname,
      role: properties.role,
      origin: properties.origin,
      created_at: properties.created_at,
      access_token,
      refresh_token
    }
  }
}
