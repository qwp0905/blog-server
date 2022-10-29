import { RequestHandler, Router } from 'express'
import * as passport from 'passport'
import { Role } from '../@types/account'
import { jwtStrategy } from '../container'
import { IAccount, IAccountProperties } from '../modules/account/domain/account'

const roleGuard =
  (role?: Role): RequestHandler =>
  (req, _, next) => {
    if (!role) {
      return next()
    }

    const account = req.user as IAccount
    account.compareRole(role)

    return next()
  }

interface AuthOptions {
  role?: Role
  key?: keyof IAccountProperties
}

const userSelector =
  (key?: keyof IAccountProperties): RequestHandler =>
  (req, _, next) => {
    if (!key) {
      return next()
    }
    const account = req.user as IAccount
    req.user = account.properties()[key]
    return next()
  }

export const Auth = (options?: AuthOptions): RequestHandler => {
  const router = Router()

  router.use(
    passport
      .use('jwt', jwtStrategy)
      .authenticate('jwt', { session: false, failWithError: true }),
    roleGuard(options?.role),
    userSelector(options?.key)
  )
  return router
}
