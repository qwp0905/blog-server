import * as dotenv from 'dotenv'
dotenv.config()
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'
})
import app from './container'

const bootstrap = async () => {
  await app.initializeDatabase()

  app.initializeMiddleWares()

  app.initializeControllers()

  app.initializeErrorMiddleware()

  app.listen()
}
bootstrap()
