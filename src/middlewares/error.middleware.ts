import { ErrorRequestHandler } from 'express'
import { HttpException } from '../shared/lib/http.exception'
import { DateFormat } from '../shared/utils/date'

export const ErrorMiddleWare: ErrorRequestHandler = (exception, req, res, next) => {
  const error_status =
    (exception instanceof HttpException && exception.getStatus()) ||
    exception.status ||
    500

  console.error(exception)
  res.status(200).json({
    code: error_status,
    result: false,
    message: exception.message,
    timestamp: DateFormat()
  })
  next()
}
