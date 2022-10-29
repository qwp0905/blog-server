import { Router } from 'express'
import { Auth } from '../../../middlewares/auth.middleware'
import { File } from '../../../middlewares/file.middleware'
import { IController } from '../../../shared/interfaces/controller.interface'
import { CommandBus } from '../../../shared/lib/bus'
import { Http400Exception } from '../../../shared/lib/http.exception'
import { Handler, Wrap } from '../../../shared/lib/request-handler'
import { UploadCommand } from '../application/upload.command'

export class UploadController implements IController {
  readonly path = '/upload'
  readonly router = Router()

  constructor(private readonly commandBus: CommandBus) {
    const router = Router()

    router.post('/', Auth(), File('image'), Wrap(this.upload))

    this.router.use(this.path, router)
  }

  private upload: Handler = async (req): Promise<string> => {
    const image = req.file

    if (!image) {
      throw new Http400Exception('이미지는 필수입니다.')
    }

    const command = new UploadCommand(image)
    return await this.commandBus.execute(command)
  }
}
