import { Http409Exception } from '../../../../../shared/lib/http.exception'
import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { AccountFactory } from '../../../domain/account.factory'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import {
  CreateAccountCommand,
  CREATE_ACCOUNT,
  ICreateAccountCommand
} from './create-account.command'

export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  readonly key = CREATE_ACCOUNT

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly accountFactory: AccountFactory
  ) {}

  async execute({ email, nickname, password }: ICreateAccountCommand): Promise<void> {
    const is_exists_email = await this.accountRepository.findOneByEmail(email)
    if (!!is_exists_email) {
      throw new Http409Exception('이미 존재하는 이메일입니다.')
    }

    const is_exists_nick = await this.accountRepository.findOneByNickname(nickname)
    if (!!is_exists_nick) {
      throw new Http409Exception('이미 존재하는 닉네임입니다.')
    }

    const account = this.accountFactory.create(email, password, nickname)
    account.hashPassword()

    await this.accountRepository.insertOne(account)
  }
}
