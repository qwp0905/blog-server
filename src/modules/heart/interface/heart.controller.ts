import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus, QueryBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { Validator } from '../../../shared/lib/validator'
import { CreateHeartCommand } from '../application/command/create-heart/create-heart.command'
import { DeleteHeartCommand } from '../application/command/delete-heart/delete-heart.command'
import { FindHeartQuery } from '../application/query/find-heart.query'

export class HeartController implements IController {
  readonly path = '/heart'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {
    const router = Router()

    router
      .get('/:id', Auth({ key: 'id' }), Wrap(this.find))
      .post('/:id', Auth({ key: 'id' }), Wrap(this.create))
      .delete('/:id', Auth({ key: 'id' }), Wrap(this.delete))

    this.router.use(this.path, router)
  }

  private find: Handler = async (req): Promise<boolean> => {
    const article_id = req.params.id
    const account_id = req.user as number

    const query = new FindHeartQuery(account_id, this.validator.numberPipe(article_id))
    return await this.queryBus.execute(query)
  }

  private create: Handler = async (req): Promise<void> => {
    const article_id = req.params.id
    const account_id = req.user as number

    const command = new CreateHeartCommand(
      account_id,
      this.validator.numberPipe(article_id)
    )
    await this.commandBus.execute(command)
  }

  private delete: Handler = async (req): Promise<void> => {
    const article_id = req.params.id
    const account_id = req.user as number

    const command = new DeleteHeartCommand(
      account_id,
      this.validator.numberPipe(article_id)
    )
    await this.commandBus.execute(command)
  }
}
