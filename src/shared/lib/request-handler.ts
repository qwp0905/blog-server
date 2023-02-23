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
) => StreamObject<any>

export const WrapStream = (handler: Handler): RequestHandler =>
  async function (req, res, next) {
    try {
      const stream_object = await handler(req)

      const stream = stream_object.getStream()

      res.setHeader('Content-Type', 'application/json')

      stream.on('data', (chunk: any) => {
        res.write(JSON.stringify(chunk) + '\n')
      })

      stream.on('error', (err: unknown) => {
        stream.emit('close')
        next(err)
      })

      stream.on('end', () => {
        res.status(200).end()
      })
    } catch (error) {
      next(error)
    }
  }
