import { NextFunction, Request, RequestHandler, Response } from 'express'
import { DateFormat } from '../utils/date'
import { StreamObject } from './stream'

export type Handler = (
  req: Request,
  res?: Response,
  next?: NextFunction
) => any | Promise<any>

export const Wrap =
  (handler: Handler): RequestHandler =>
  async (req, res, next) => {
    try {
      const data = await handler(req, res, next)
      res.json({ result: true, data, timestamp: DateFormat() })
    } catch (error) {
      next(error)
    }
  }

export type StreamHandler = (
  req: Request,
  res?: Response,
  next?: NextFunction
) => StreamObject | Promise<StreamObject>

export const WrapStream = (handler: StreamHandler): RequestHandler =>
  async function (req, res, next) {
    try {
      const stream = await handler(req)

      res.setHeader('Content-Type', 'application/json')
      stream.read({
        next(chunk) {
          res.write(JSON.stringify(chunk) + '\n')
        },
        error(error) {
          next(error)
        },
        complete() {
          res.status(200).end()
        }
      })
    } catch (err: unknown) {
      next(err)
    }
  }
