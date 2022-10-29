import { ICommand } from '../../../shared/interfaces/command'

export interface IUploadCommand {
  image: Express.Multer.File
}

export const UPLOAD_IMAGE = 'upload-image'

export class UploadCommand implements ICommand {
  readonly key = UPLOAD_IMAGE
  readonly context: IUploadCommand

  constructor(image: Express.Multer.File) {
    this.context = { image }
  }
}
