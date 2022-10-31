import { NextFunction, Request, RequestHandler, Response } from 'express'
import { DateFormat } from '../utils/date'

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
