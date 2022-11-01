import { Http400Exception } from './http.exception'

export class Validator {
  string(param?: unknown): string {
    if (!param || typeof param !== 'string') {
      throw new Http400Exception(`${param} must be string`)
    }
    return param
  }

  stringOptional(param?: unknown): string | undefined {
    if (param === undefined) {
      return param
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
    if (param === undefined) {
      return param
    }
    return this.number(param)
  }

  numberPipe(param?: unknown): number {
    return this.number(+param)
  }

  numberOptionalPipe(param?: unknown): number | undefined {
    if (param === undefined) {
      return param
    }
    return this.numberPipe(param)
  }

  boolean(param?: unknown): boolean {
    if (typeof param !== 'boolean') {
      throw new Http400Exception(`${param} must be boolean`)
    }
    return param
  }

  enum(list: string[], param?: unknown): string {
    if (!param || typeof param !== 'string') {
      throw new Http400Exception(`${param} must be enum ${list.join(',')}`)
    }

    if (!~list.indexOf(param)) {
      throw new Http400Exception(`${param} must be enum ${list.join(',')}`)
    }
    return param
  }

  array(param?: unknown, length?: number): unknown[] {
    if (!Array.isArray(param)) {
      throw new Http400Exception(`${param} must be string array`)
    }

    if (length ?? length !== param.length) {
      throw new Http400Exception(`${param} must be string array`)
    }
    return param
  }

  stringArray(param?: unknown, length?: number): string[] {
    return this.array(param, length).map((e) => this.string(e))
  }

  numberArray(param?: unknown, length?: number): number[] {
    return this.array(param, length).map((e) => this.number(e))
  }
}
