import internal, { pipeline, Readable, Transform, Writable } from 'stream'
import { nullFunction } from './etc'

type TFilterCallback<T> = (arg: T, index?: number) => boolean | Promise<boolean>
type TMapCallback<T, R> = (arg: T, index?: number) => R | Promise<R>
type TTapCallback<T> = (arg: T, index?: number) => void | Promise<void>
type TReduceCallback<A, C> = (acc: A, cur: C, index?: number) => A | Promise<A>

interface IReadStreamOptions<T> {
  next: (chunk: T) => void
  error?: (error: unknown) => void
  complete?: () => void
}

class ObjectModeTransform extends Transform {
  constructor(options: internal.TransformOptions) {
    super({
      ...options,
      objectMode: true
    })
  }
}

export class StreamObject<T = any> {
  private stream: (Writable | Transform)[] = []

  constructor(private source: Readable | Writable | Transform) {}

  private pipe<R = T>(stream: Writable | Transform) {
    this.stream.push(stream)
    return this as unknown as StreamObject<R>
  }

  read({ next, error = nullFunction, complete = nullFunction }: IReadStreamOptions<T>) {
    const stream = pipeline(this.source as any, ...(this.stream as any), () => {
      stream.emit('close')
    })

    stream.on('data', next)

    stream.on('error', error)

    stream.on('end', complete)
  }

  toPromise() {
    return new Promise<T>((res, rej) => {
      let result: T

      this.read({
        next(chunk) {
          result = chunk
        },
        error(err) {
          rej(err)
        },
        complete() {
          res(result)
        }
      })
    })
  }

  toArray() {
    return new Promise<T[]>((res, rej) => {
      const result: T[] = []

      this.read({
        next(chunk) {
          result.push(chunk)
        },
        error(err) {
          rej(err)
        },
        complete() {
          res(result)
        }
      })
    })
  }

  filter(callback: TFilterCallback<T>) {
    return this.pipe(filterStream(callback))
  }

  map<R = T>(callback: TMapCallback<T, R>) {
    return this.pipe<R>(mapStream<T, R>(callback))
  }

  tap(callback: TTapCallback<T>) {
    return this.pipe(tapStream<T>(callback))
  }

  reduce<A = T>(callback: TReduceCallback<A, T>, initialValue: A) {
    return this.pipe<A>(reduceStream<A, T>(callback, initialValue))
  }

  skip(num: number) {
    return this.pipe(skipStream(num))
  }

  take(num: number) {
    return this.pipe(takeStream(num))
  }
}

export const fromStream = <T = any>(stream: Readable | Writable | Transform) =>
  new StreamObject<T>(stream)

const filterStream = <T>(callback: TFilterCallback<T>) => {
  let index = 0

  return new ObjectModeTransform({
    transform: async function (chunk, _, next) {
      try {
        index++
        const condition = await callback(chunk, index - 1)
        condition ? next(null, chunk) : next()
      } catch (err) {
        next(err)
      }
    }
  })
}

const tapStream = <T>(callback: TTapCallback<T>) => {
  let index = 0

  return new ObjectModeTransform({
    transform: async function (chunk, _, next) {
      try {
        index++
        await callback(chunk, index - 1)
        next(null, chunk)
      } catch (err) {
        next(err)
      }
    }
  })
}

const reduceStream = <A, C>(callback: TReduceCallback<A, C>, initialValue: A) => {
  let index = 0

  return new ObjectModeTransform({
    transform: async function (chunk, _, next) {
      try {
        index++
        initialValue = await callback(initialValue || chunk, chunk, index - 1)
        next()
      } catch (err) {
        next(err)
      }
    },
    flush: function (this, next) {
      next(null, initialValue)
    }
  })
}

const mapStream = <T, R>(callback: TMapCallback<T, R>) => {
  let index = 0

  return new ObjectModeTransform({
    transform: async (chunk, _, next) => {
      try {
        index++
        next(null, await callback(chunk, index - 1))
      } catch (err) {
        next(err)
      }
    }
  })
}

const skipStream = (num: number) => {
  let index = 0

  return new ObjectModeTransform({
    transform: function (this, chunk, _, next) {
      index++
      if (index <= num) {
        next()
      } else {
        next(null, chunk)
      }
    }
  })
}

const takeStream = (num: number) => {
  let index = 0

  return new ObjectModeTransform({
    transform: function (this, chunk, _, next) {
      index++
      if (index <= num) {
        next(null, chunk)
      } else {
        this.emit('end')
      }
    }
  })
}