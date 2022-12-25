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

  constructor(private readonly controllers: IController[]) {
    this.app = express()
  }

  initializeControllers() {
    const router = express.Router()

    router.get('/', (_, res) => {
      return res.json()
    })

    this.controllers.forEach((controller) => {
      router.use(controller.router)
    })

    this.app.use(router)
    console.log('Controllers initialized')
  }

  async initializeDatabase() {
    await Promise.all([DATABASE.initialize(), REDIS_CACHE.ping()])
    console.log('Database initialized')
    console.log('Redis initialized')
  }

  initializeMiddleWares() {
    this.app.use(
      express.json({ limit: '50mb' }),
      express.urlencoded({ extended: false }),
      // cors({ credentials: true, origin: process.env.CLIENT_HOST }),
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

    this.app
      .listen(port, () => {
        console.log(`App listening on the port ${port}`)
      })
      .setTimeout(60 * 1000)
  }
}
