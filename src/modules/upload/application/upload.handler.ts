import { ICommandHandler } from '../../../shared/interfaces/command'
import { Container } from '../../../shared/lib/container'
import { IAmazonAdapter } from '../interface/adapters/amazon.adapter.interface'
import { IUploadCommand, UploadCommand, UPLOAD_IMAGE } from './upload.command'

export class UploadHandler implements ICommandHandler<UploadCommand, string> {
  readonly key = UPLOAD_IMAGE
  constructor(private readonly amazonAdapter: IAmazonAdapter) {}

  async execute({ image }: IUploadCommand): Promise<string> {
    const path = await this.amazonAdapter.uploadFile(image)
    return path
  }
}
Container.register(UploadHandler, [])
