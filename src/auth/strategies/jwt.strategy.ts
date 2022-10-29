import { ExtractJwt, Strategy } from 'passport-jwt'
import { FindAccountCommand } from '../../modules/account/application/command/find-account/find-account.command'
import { CommandBus } from '../../shared/lib/bus'
import { Http403Exception } from '../../shared/lib/http.exception'

export class JwtStrategy extends Strategy {
  constructor(private readonly commandBus: CommandBus) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        const user = await this.validate(payload)
        if (!user) {
          return done(new Http403Exception('인증정보가 없습니다.'), false)
        }

        return done(null, user)
      }
    )
  }

  async validate({ id }: JwtPayload) {
    const command = new FindAccountCommand(id)
    return await this.commandBus.execute(command)
  }
}

interface JwtPayload {
  id: number
  email: string
}
