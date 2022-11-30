import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { File } from '../../../middlewares/file.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus } from '../../../shared/lib/bus'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { ValidationPipe } from '../../../shared/lib/validation-pipe'
import { UploadCommand } from '../application/upload.command'

export class UploadController implements IController {
  readonly path = '/upload'
  readonly router = Router()

  constructor(
    private readonly commandBus: CommandBus,
    private readonly validationPipe: ValidationPipe
  ) {
    const router = Router()

    router.post('/', Auth(), File('image'), Wrap(this.upload))

    this.router.use(this.path, router)
  }

  private upload: Handler = async (req): Promise<string> => {
    const image = req.file

    const command = new UploadCommand(this.validationPipe.exists(image))
    return await this.commandBus.execute(command)
  }
}
