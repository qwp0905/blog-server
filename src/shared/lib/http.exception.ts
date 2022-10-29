export class HttpException extends Error {
  constructor(private readonly status: number, readonly message: string) {
    super(message)
  }

  getStatus() {
    return this.status
  }
}

export class Http400Exception extends HttpException {
  constructor(readonly message = '400 - Bad Request') {
    super(400, message)
  }
}

export class Http401Exception extends HttpException {
  constructor(readonly message = '401 - Unauthorized') {
    super(401, message)
  }
}

export class Http403Exception extends HttpException {
  constructor(readonly message = '403 - Forbidden') {
    super(403, message)
  }
}

export class Http404Exception extends HttpException {
  constructor(readonly message = '404 - Not Found') {
    super(404, message)
  }
}

export class Http409Exception extends HttpException {
  constructor(readonly message = '409 - Conflict') {
    super(409, message)
  }
}
