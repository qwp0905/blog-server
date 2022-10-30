import { JwtService } from './jwt.service'
jest.mock('jsonwebtoken')
import * as JWT from 'jsonwebtoken'

describe('Auth-JwtService', () => {
  let service: JwtService

  beforeEach(() => {
    service = new JwtService('secret')
  })

  describe('1. sign TEST', () => {
    beforeEach(() => {
      ;(JWT.sign as jest.Mock).mockReturnValue('token')
    })

    it('1. test', () => {
      const result = service.sign({ id: 123, email: '123' }, { expiresIn: '12s' })

      expect(result).toBe('token')
      expect(JWT.sign).toBeCalledWith({ id: 123, email: '123' }, 'secret', {
        expiresIn: '12s'
      })
    })
  })
})
