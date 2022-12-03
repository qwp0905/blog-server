import { sign, SignOptions } from 'jsonwebtoken'

export class JwtService {
  constructor(private readonly secret: string) {}

  sign(payload: string | object | Buffer, options: SignOptions) {
    return sign(payload, this.secret, options)
  }
}
