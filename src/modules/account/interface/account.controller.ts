import { Router } from 'express'
import { Http400Exception } from '../../../shared/lib/http.exception'
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

export class AccountController implements IController {
  readonly path = '/account'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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

    if (!email || typeof email !== 'string') {
      throw new Http400Exception('이메일은 필수입니다.')
    }
    if (!password || typeof password !== 'string') {
      throw new Http400Exception('패스워드는 필수입니다.')
    }
    if (!nickname || typeof nickname !== 'string') {
      throw new Http400Exception('닉네임은 필수입니다.')
    }
    const command = new CreateAccountCommand(email, password, nickname)
    await this.commandBus.execute(command)
  }

  login: Handler = async (req): Promise<LoginResponse> => {
    const { email, password }: LoginDto = req.body

    if (!email) {
      throw new Http400Exception('로그인 실패')
    }

    if (!password) {
      throw new Http400Exception('로그인 실패')
    }

    const command = new LoginCommand(email, password)
    return await this.commandBus.execute(command)
  }

  logout: Handler = async (req): Promise<void> => {
    const account = req.user as IAccount

    const command = new LogoutCommand(account)
    await this.commandBus.execute(command)
  }

  update: Handler = async (req): Promise<void> => {
    const account = req.user as IAccount
    const { nickname, password, introduction }: UpdateAccountDto = req.body

    const command = new UpdateAccountCommand(account, nickname, password, introduction)
    await this.commandBus.execute(command)
  }

  refresh: Handler = async (req): Promise<string> => {
    const account = req.user as IAccount

    const command = new RefreshTokenCommand(account)
    return await this.commandBus.execute(command)
  }

  findProfile: Handler = async (req): Promise<FindProfileResponse> => {
    const id = +req.params.id

    if (id !== 0 && !id) {
      throw new Http400Exception('잘못된 아이디입니다.')
    }
    const query = new FindProfileQuery(id)
    return await this.queryBus.execute(query)
  }
}
