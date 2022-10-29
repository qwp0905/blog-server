import { ICommandHandler } from '../../shared/interfaces/command'
import { JwtService } from '../jwt.service'
import {
  GenerateTokenCommand,
  GENERATE_TOKEN,
  IGenerateTokenCommand
} from './generate-token.command'

export class GenerateTokenHandler
  implements ICommandHandler<GenerateTokenCommand, string>
{
  readonly key = GENERATE_TOKEN
  constructor(private readonly jwtService: JwtService) {}

  async execute({
    id,
    email,
    expiresIn = '10s'
  }: IGenerateTokenCommand): Promise<string> {
    return this.jwtService.sign({ id, email }, { expiresIn })
  }
}
