import { ICommandHandler } from '../../../../../shared/interfaces/command'
import { Http409Exception } from '../../../../../shared/lib/http.exception'
import { IAccountRepository } from '../../../domain/account.repository.interface'
import {
  IUpdateAccountCommand,
  UpdateAccountCommand,
  UPDATE_ACCOUNT
} from './update-account.command'

export class UpdateAccountHandler implements ICommandHandler<UpdateAccountCommand> {
  readonly key = UPDATE_ACCOUNT
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute({
    account,
    nickname,
    password,
    introduction
  }: IUpdateAccountCommand): Promise<void> {
    if (nickname) {
      const is_exists_nick = await this.accountRepository.findOneByNickname(nickname)
      if (!!is_exists_nick) {
        throw new Http409Exception('이미 존재하는 닉네임입니다.')
      }
    }

    account.update(nickname, password, introduction)

    await this.accountRepository.updateOne(account)
  }
}
