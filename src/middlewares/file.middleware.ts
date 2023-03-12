import { RequestHandler } from 'express'
import * as multer from 'multer'
import { Http400Exception } from '../shared/lib/http.exception'

export const File = (field: string): RequestHandler =>
  multer({
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter(_, file, callback) {
      const type = file.mimetype
      if (!type.match(/^image/)) {
        return callback(new Http400Exception('지원하지 않는 타입입니다.'))
      }

      return callback(null, true)
    }
  }).single(field)
