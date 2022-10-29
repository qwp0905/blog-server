import * as dotenv from 'dotenv'
dotenv.config()
dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'
})

import { App } from './app'

const bootstrap = async () => {
  const app = new App()

  await app.initializeDatabase()

  app.initializeMiddleWares()

  const Container = (await import('./container')).default
  app.initializeControllers(Container)

  app.initializeErrorMiddleware()

  app.listen()
}
bootstrap()
