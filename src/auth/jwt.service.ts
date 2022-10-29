import { sign, SignOptions } from 'jsonwebtoken'

export class JwtService {
  constructor(private readonly secret: string) {}

  sign(payload: string | object | Buffer, options: SignOptions) {
    const token = sign(payload, this.secret, options)
    return token
  }
}
