import * as express from 'express'
import { IController } from './shared/interfaces/controller.interface'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import helmet from 'helmet'
import * as morgan from 'morgan'
import { ErrorMiddleWare } from './middlewares/error.middleware'
import { DATABASE, REDIS_CACHE } from './container'

export class App {
  private app: express.Application

  constructor() {
    this.app = express()
  }

  initializeControllers(controllers: IController[]) {
    const router = express.Router()

    controllers.forEach((controller) => {
      router.use(controller.router)
    })

    this.app.use(router)
    console.log('Controllers initialized')
  }

  async initializeDatabase() {
    await DATABASE.initialize()
    console.log('Database initialized')
    await REDIS_CACHE.ping()
    console.log('Redis initialized')
  }

  initializeMiddleWares() {
    this.app.use(
      express.json({ limit: '50mb' }),
      express.urlencoded({ extended: false }),
      cors({ credentials: true }),
      helmet(),
      cookieParser()
    )

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'))
    }
  }

  initializeErrorMiddleware() {
    this.app.use(ErrorMiddleWare)
    console.log('Middleware initialized')
  }

  listen() {
    const port = process.env.PORT ?? 3001

    const server = this.app.listen(port, () => {
      console.log(`App listening on the port ${port}`)
    })
    server.timeout = 60 * 60 * 1000
  }
}
