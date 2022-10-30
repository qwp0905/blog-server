import { Mock } from '../../@types/test'
import { JwtService } from '../jwt.service'
import { GenerateTokenCommand, IGenerateTokenCommand } from './generate-token.command'
import { GenerateTokenHandler } from './generate-token.handler'

const mockJwtService = () => ({
  sign: jest.fn()
})

describe('Auth-GenerateToken', () => {
  let handler: GenerateTokenHandler
  let jwtService: Mock<JwtService>

  beforeEach(() => {
    jwtService = mockJwtService()

    handler = new GenerateTokenHandler(jwtService as unknown as JwtService)
  })

  describe('TEST', () => {
    let command: IGenerateTokenCommand

    beforeEach(() => {
      command = new GenerateTokenCommand(123, 'email').context

      jwtService.sign.mockReturnValue('token')
    })

    it('1. for access token', async () => {
      const result = handler.execute(command)

      await expect(result).resolves.toEqual('token')
      expect(jwtService.sign).toBeCalledWith(
        { id: 123, email: 'email' },
        { expiresIn: '10s' }
      )
    })

    it('2. for refresh token', async () => {
      command = new GenerateTokenCommand(11, 'ee', '12h').context

      const result = handler.execute(command)

      await expect(result).resolves.toEqual('token')
      expect(jwtService.sign).toBeCalledWith(
        { id: 11, email: 'ee' },
        { expiresIn: '12h' }
      )
    })
  })
})
