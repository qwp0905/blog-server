import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import { ILogoutCommand, LOGOUT, LogoutCommand } from './logout.command'

export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  readonly key = LOGOUT

  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute({ account }: ILogoutCommand): Promise<void> {
    account.logout()

    await this.accountRepository.updateOne(account)
  }
}
