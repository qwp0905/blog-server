import { Http400Exception } from './http.exception'

export class ValidationPipe {
  string(param?: unknown): string {
    if (typeof param !== 'string') {
      throw new Http400Exception(`${param} must be string`)
    }
    return param
  }

  stringOptional(param?: unknown): string | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.string(param)
  }

  number(param?: unknown): number {
    if (typeof param !== 'number' || isNaN(param)) {
      throw new Http400Exception(`${param} must be number`)
    }
    return param
  }

  numberOptional(param?: unknown): number | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.number(param)
  }

  numberPipe(param?: unknown): number {
    return this.number(+param)
  }

  numberOptionalPipe(param?: unknown): number | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.numberPipe(param)
  }

  boolean(param?: unknown): boolean {
    if (typeof param !== 'boolean') {
      throw new Http400Exception(`${param} must be boolean`)
    }
    return param
  }

  enum(param: unknown, list: string[]): string {
    if (typeof param !== 'string') {
      throw new Http400Exception(`${param} must be enum ${list.join(',')}`)
    }

    if (!~list.indexOf(param)) {
      throw new Http400Exception(`${param} must be enum ${list.join(',')}`)
    }
    return param
  }

  array(param?: unknown, max_length?: number): unknown[] {
    if (!Array.isArray(param)) {
      throw new Http400Exception(`${param} must be array`)
    }

    if (max_length && max_length < param.length) {
      throw new Http400Exception(`${param} must be shorter than ${max_length}`)
    }

    if (!param.length) {
      throw new Http400Exception(`${param} must be none empty`)
    }
    return param
  }

  arrayOptional(param?: unknown, max_length?: number): unknown[] | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.array(param, max_length)
  }

  stringArray(param?: unknown, max_length?: number): string[] {
    return this.array(param, max_length).map((e) => this.string(e))
  }

  stringArrayOptional(param?: unknown, max_length?: number): string[] | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.stringArray(param, max_length)
  }

  numberArray(param?: unknown, max_length?: number): number[] {
    return this.array(param, max_length).map((e) => this.number(e))
  }

  numberArrayOptional(param?: unknown, max_length?: number): number[] | undefined {
    if (param === undefined || param === null) {
      return
    }
    return this.numberArray(param, max_length)
  }

  exists<T>(param: T): T {
    if (
      param === undefined ||
      param === null ||
      (typeof param === 'number' && isNaN(param))
    ) {
      throw new Http400Exception(`${param} must be exists`)
    }
    return param
  }
}
