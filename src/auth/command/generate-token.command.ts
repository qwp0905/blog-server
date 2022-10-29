import { ICommand } from '../../shared/interfaces/command'

export interface IGenerateTokenCommand {
  id: number
  email: string
  expiresIn?: string
}

export const GENERATE_TOKEN = 'generate-token'

export class GenerateTokenCommand implements ICommand {
  readonly key = GENERATE_TOKEN
  readonly context: IGenerateTokenCommand
  constructor(id: number, email: string, expiresIn?: string) {
    this.context = { id, email, expiresIn }
  }
}
