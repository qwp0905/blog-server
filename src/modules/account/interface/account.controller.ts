import { Router } from 'express'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { CreateAccountCommand } from '../application/command/create-account/create-account.command'
import { CreateAccountDto } from './dto/create-account.dto'
import { LoginDto, LoginResponse } from './dto/login.dto'
import { LoginCommand } from '../application/command/login/login.command'
import { IAccount } from '../domain/account'
import { LogoutCommand } from '../application/command/logout/logout.command'
import { Auth } from '../../../middlewares/auth.middleware'
import { UpdateAccountDto } from './dto/update-account.dto'
import { UpdateAccountCommand } from '../application/command/update-account/update-account.command'
import { RefreshTokenCommand } from '../application/command/refresh-token/refresh-token.command'
import { FindProfileQuery } from '../application/query/find-profile.query'
import { FindProfileResponse } from './dto/find-profile.dto'
import { Validator } from '../../../shared/lib/validator'

export class AccountController implements IController {
  readonly path = '/account'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {
    const router = Router()

    router
      .post('/', Wrap(this.create))
      .post('/login', Wrap(this.login))
      .post('/logout', Auth(), Wrap(this.logout))
      .patch('/', Auth(), Wrap(this.update))
      .get('/refresh', Auth(), Wrap(this.refresh))
      .get('/:id', Wrap(this.findProfile))

    this.router.use(this.path, router)
  }

  create: Handler = async (req): Promise<void> => {
    const { email, password, nickname }: CreateAccountDto = req.body

    const command = new CreateAccountCommand(
      this.validator.string(email),
      this.validator.string(password),
      this.validator.string(nickname)
    )
    await this.commandBus.execute(command)
  }

  login: Handler = async (req): Promise<LoginResponse> => {
    const { email, password }: LoginDto = req.body

    const command = new LoginCommand(
      this.validator.string(email),
      this.validator.string(password)
    )
    return await this.commandBus.execute(command)
  }

  logout: Handler = async (req): Promise<void> => {
    const account = req.user as IAccount

    const command = new LogoutCommand(account)
    await this.commandBus.execute(command)
  }

  update: Handler = async (req): Promise<void> => {
    const account = req.user as IAccount
    const { nickname, password }: UpdateAccountDto = req.body

    const command = new UpdateAccountCommand(
      account,
      this.validator.stringOptional(nickname),
      this.validator.stringOptional(password)
    )
    await this.commandBus.execute(command)
  }

  refresh: Handler = async (req): Promise<string> => {
    const account = req.user as IAccount

    const command = new RefreshTokenCommand(account)
    return await this.commandBus.execute(command)
  }

  findProfile: Handler = async (req): Promise<FindProfileResponse> => {
    const id = req.params.id

    const query = new FindProfileQuery(this.validator.numberPipe(id))
    return await this.queryBus.execute(query)
  }
}
