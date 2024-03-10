import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Container } from '../../../../../shared/lib/container'
import { Http404Exception } from '../../../../../shared/lib/http.exception'
import { IAccount } from '../../../domain/account'
import {
  ACCOUNT_REPOSITORY,
  IAccountRepository
} from '../../../domain/account.repository.interface'
import {
  FindAccountCommand,
  FIND_ACCOUNT,
  IFindAccountCommand
} from './find-account.command'

export class FindAccountHandler implements ICommandHandler<FindAccountCommand, IAccount> {
  readonly key = FIND_ACCOUNT

  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute({ id }: IFindAccountCommand): Promise<IAccount> {
    const account = await this.accountRepository.findOneById(id)

    if (!account) {
      throw new Http404Exception('존재하지 않는 유저입니다.')
    }
    return account
  }
}
Container.register(FindAccountHandler, [ACCOUNT_REPOSITORY])
