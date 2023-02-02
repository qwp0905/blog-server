import app from './container'

const bootstrap = async () => {
  await app.initializeDatabase()

  app.initializeMiddleWares()

  app.initializeControllers()

  app.initializeErrorMiddleware()

  app.listen()
}
bootstrap()
