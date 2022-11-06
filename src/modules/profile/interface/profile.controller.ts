import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { Validator } from '../../../shared/lib/validator'
import { UpdateProfileCommand } from '../application/command/update-profile.command'
import { FindProfileQuery } from '../application/query/find-profile.query'

export class ProfileController implements IController {
  readonly path = '/profile'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {
    const router = Router()

    router
      .get('/', Wrap(this.find))
      .patch('/', Auth({ key: 'id', role: 'admin' }), Wrap(this.update))

    this.router.use(this.path, router)
  }

  find: Handler = async () => {
    const query = new FindProfileQuery()
    return await this.queryBus.execute(query)
  }

  update: Handler = async (req) => {
    const { content } = req.body
    const account_id = req.user as number

    const command = new UpdateProfileCommand(account_id, this.validator.string(content))

    await this.commandBus.execute(command)
  }
}
