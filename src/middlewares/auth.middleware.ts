import { RequestHandler, Router } from 'express'
import * as passport from 'passport'
import { AccountRole } from '../@types/account'
import { jwtStrategy } from '../container'
import { IAccount, IAccountProperties } from '../modules/account/domain/account'

const roleGuard =
  (role?: AccountRole): RequestHandler =>
  (req, _, next) => {
    if (!role) {
      return next()
    }

    const account = req.user as IAccount
    account.compareRole(role)

    return next()
  }

interface AuthOptions {
  role?: AccountRole
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

const passportMiddleware: RequestHandler = (req, res, next) => {
  const origin = req.header('x-account-origin')

  return passport
    .use('local', jwtStrategy)
    .authenticate(origin, { session: false, failWithError: true })(req, res, next)
}

export const Auth = (options?: AuthOptions): RequestHandler => {
  const router = Router()

  router.use(passportMiddleware, roleGuard(options?.role), userSelector(options?.key))
  return router
}
