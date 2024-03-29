import internal, {
  EventEmitter,
  PassThrough,
  pipeline,
  Readable,
  Stream,
  Transform,
  Writable
} from 'stream'
import { nullFunction } from '../utils'

type TFilterCallback<T> = (arg: T, index?: number) => boolean
type TMapCallback<T, R> = (arg: T, index?: number) => R
type TTapCallback<T> = (arg: T, index?: number) => void
type TReduceCallback<A, C> = (acc: A, cur: C, index?: number) => A

type Iter<T> = AsyncIterable<T> | Iterable<T>
type CanBeStream<T> = Readable | Writable | Transform | Iter<T> | IStreamObject<T>

interface IReadStreamOptions<T> {
  next: (chunk: T) => void
  error?: (error: unknown) => void
  complete?: () => void
}

interface IStreamObject<T> extends AsyncIterable<T> {
  read(options: IReadStreamOptions<T>): void
  toPromise(): Promise<T>
  toArray(): Promise<T[]>
  filter(callback: TFilterCallback<T>): IStreamObject<T>
  map<R = T>(callback: TMapCallback<T, R | Promise<R>>): IStreamObject<R>
  tap(callback: TTapCallback<T>): IStreamObject<T>
  reduce<A = T>(callback: TReduceCallback<A, T>, initialValue?: A): IStreamObject<A>
  skip(num: number): IStreamObject<T>
  take(num: number): IStreamObject<T>
  parallel(num: number): IStreamObject<T>
  bufferCount(num: number): IStreamObject<T[]>
  mergeAll(): IStreamObject<T extends CanBeStream<infer K> ? K : never>
  concatAll(): IStreamObject<T extends CanBeStream<infer K> ? K : never>
  delay(ms: number): IStreamObject<T>
  copy(count: number): IStreamObject<T>[]
  split(delimiter: string): IStreamObject<string>
  buffer(callback: TFilterCallback<T>): IStreamObject<T[]>
  finalize(callback: () => any): IStreamObject<T>
}

class ObjectModeTransform extends Transform {
  constructor(options: internal.TransformOptions) {
    super({ ...options, objectMode: true })
  }
}
class ObjectModePassThrough extends PassThrough {
  constructor(options?: internal.TransformOptions) {
    super({ ...(options || {}), objectMode: true })
  }
}

export class StreamObject<T = any> implements IStreamObject<T> {
  private stream: (Writable | Transform)[] = []
  private source: Readable | Writable | Transform
  private concurrency: number

  constructor(iter: Readable | Writable | Transform | Iter<T>) {
    switch (true) {
      case iter instanceof Stream:
        this.source = iter as Readable
        break
      case typeof iter[Symbol.asyncIterator] === 'function':
      case typeof iter[Symbol.iterator] === 'function':
        this.source = Readable.from(iter as Iter<T>, { objectMode: true })
        break
      default:
        throw new Error('does not match on support type')
    }
  }

  async *[Symbol.asyncIterator]() {
    for await (const data of this.toStream() as AsyncIterable<T>) {
      yield data
    }
  }

  static from<T>(stream: CanBeStream<T>): IStreamObject<T> {
    if (stream instanceof StreamObject) {
      return stream as IStreamObject<T>
    }

    return new StreamObject(stream)
  }

  static merge<T>(...streams: CanBeStream<T>[]): IStreamObject<T> {
    return StreamObject.from(streams).mergeAll()
  }

  static concat<T>(
    ...streams: (Readable | Writable | Transform | Iter<T> | IStreamObject<T>)[]
  ): IStreamObject<T> {
    return StreamObject.from(streams).concatAll()
  }

  private pipe<R = T>(stream: Writable | Transform): IStreamObject<R> {
    this.stream.push(stream)
    return this as unknown as StreamObject<R>
  }

  private toStream() {
    const stream = this.stream.length
      ? pipeline(
          this.source as any,
          ...(this.stream as any),
          (err) => err && stream.emit('error', err)
        )
      : this.source
    return stream
  }

  read({ next, error = nullFunction, complete = nullFunction }: IReadStreamOptions<T>) {
    const stream = this.toStream()

    stream.on('data', next)
    stream.on('error', error)
    stream.on('close', complete)
  }

  toPromise() {
    return new Promise<T>((resolve, reject) => {
      let result: T

      this.read({
        next(chunk) {
          result = chunk
        },
        error(err) {
          reject(err)
        },
        complete() {
          resolve(result)
        }
      })
    })
  }

  toArray() {
    return new Promise<T[]>((resolve, reject) => {
      const result: T[] = []

      this.read({
        next(chunk) {
          result.push(chunk)
        },
        error(err) {
          reject(err)
        },
        complete() {
          resolve(result)
        }
      })
    })
  }

  filter(callback: TFilterCallback<T>) {
    return this.pipe(filterStream(callback))
  }

  map<R = T>(callback: TMapCallback<T, R | Promise<R>>) {
    if (!this.concurrency) {
      return this.pipe<R>(mapStream(callback))
    }

    const pass = new ObjectModePassThrough()
    this.read({
      next(data) {
        pass.push(data)
      },
      error(error: Error) {
        pass.destroy(error)
      },
      complete() {
        pass.end()
      }
    })

    return (StreamObject.from<T>(pass) as StreamObject)
      .pipe(parallelStream(this.concurrency, callback))
      .parallel(this.concurrency)
  }

  tap(callback: TTapCallback<T>) {
    return this.pipe(tapStream<T>(callback))
  }

  reduce<A = T>(callback: TReduceCallback<A, T>, initialValue?: A) {
    return this.pipe<A>(reduceStream<A, T>(callback, initialValue))
  }

  skip(num: number) {
    return this.pipe(skipStream(num))
  }

  take(num: number) {
    return this.pipe(takeStream(num))
  }

  parallel(concurrency: number): IStreamObject<T> {
    this.concurrency = concurrency
    return this
  }

  bufferCount(num: number): IStreamObject<T[]> {
    return this.pipe<T[]>(bufferCount(num))
  }

  mergeAll(): IStreamObject<T extends CanBeStream<infer K> ? K : never> {
    const pass = new ObjectModePassThrough()
    this.read({
      next(data) {
        pass.push(data)
      },
      error(error: Error) {
        pass.destroy(error)
      },
      complete() {
        pass.end()
      }
    })
    return (StreamObject.from(pass) as StreamObject)
      .pipe(mergeAllStream())
      .parallel(this.concurrency)
  }

  delay(ms: number): IStreamObject<T> {
    return this.pipe(delayStream(ms))
  }

  copy(count: number): IStreamObject<T>[] {
    const copied = new Array(count).fill(null).map(() => new ObjectModePassThrough())
    this.read({
      next(chunk) {
        copied.forEach((e) => e.push(chunk))
      },
      error(error: Error) {
        copied.forEach((e) => e.destroy(error))
      },
      complete() {
        copied.forEach((e) => e.end())
      }
    })

    return copied.map((e) => StreamObject.from(e))
  }

  split(delimiter: string) {
    return this.pipe<string>(splitStream(delimiter))
  }

  buffer(callback: TFilterCallback<T>) {
    return this.pipe<T[]>(bufferStream<T>(callback))
  }

  concatAll(): IStreamObject<T extends CanBeStream<infer K> ? K : never> {
    return this.pipe(concatAllStream())
  }

  finalize(callback: () => any): IStreamObject<T> {
    return this.pipe(finalizeStream(callback))
  }
}

const filterStream = <T>(callback: TFilterCallback<T>) => {
  let index = 0

  return new ObjectModeTransform({
    transform: function (chunk, _, next) {
      try {
        index++
        const condition = callback(chunk, index - 1)
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
    transform: function (chunk, _, next) {
      try {
        index++
        callback(chunk, index - 1)
        next(null, chunk)
      } catch (err) {
        next(err)
      }
    }
  })
}

const reduceStream = <A, C>(callback: TReduceCallback<A, C>, initialValue?: A) => {
  let index = 0

  return new ObjectModeTransform({
    transform: function (chunk, _, next) {
      try {
        index++
        initialValue = callback(initialValue || chunk, chunk, index - 1)
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
    transform: (chunk, _, next) => {
      try {
        index++
        next(null, callback(chunk, index - 1))
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
        this.end()
      }
    }
  })
}

const bufferCount = (num: number) => {
  let queue = []
  return new ObjectModeTransform({
    transform(chunk, _, next) {
      queue.push(chunk)
      if (queue.length < num) {
        next()
      } else {
        next(null, queue)
        queue = []
      }
    },
    flush(next) {
      queue.length ? next(null, queue) : next()
    }
  })
}

const mergeAllStream = () => {
  let running = 0
  const event = new EventEmitter()
  const is_done = new Promise((resolve) => {
    event.on('done', () => {
      if (running > 1) {
        running--
        return
      }

      event.removeAllListeners()
      resolve(null)
    })
  })

  return new ObjectModeTransform({
    transform(chunk, _, next) {
      StreamObject.from(chunk)
        .tap((e) => this.push(e))
        .toPromise()
        .then(() => event.emit('done'))
      next()
    },
    async flush(next) {
      await is_done
      next()
    }
  })
}

const concatAllStream = () => {
  return new ObjectModeTransform({
    async transform(chunk, _, next) {
      for await (const e of chunk) {
        this.push(e)
      }
      next()
    }
  })
}

const delayStream = (ms: number) => {
  return new ObjectModeTransform({
    async transform(chunk, _, next) {
      await new Promise((resolve) => setTimeout(resolve, ms))
      next(null, chunk)
    }
  })
}

const parallelStream = function <T, R>(
  concurrency: number,
  callback: TMapCallback<T, R | Promise<R>>
) {
  let index = 0
  let running = 0
  let is_empty = true
  const queue: internal.TransformCallback[] = []
  const event = new EventEmitter()
  const is_done = new Promise((resolve) => {
    event.on('done', () => {
      if (running > 0 || queue.length > 0) {
        return
      }

      event.removeAllListeners()
      resolve(null)
    })
  })

  return new ObjectModeTransform({
    async flush(next) {
      if (is_empty) {
        return next()
      }

      await is_done
      next()
    },
    transform(chunk, _, next) {
      if (is_empty) {
        is_empty = false
      }

      running++
      try {
        Promise.resolve(callback(chunk, index++))
          .then((data) => {
            this.push(data)
            running--
            while (queue.length && running < concurrency) {
              const done = queue.shift()
              done()
            }
            event.emit('done')
          })
          .catch((err) => this.destroy(err))

        if (running >= concurrency) {
          queue.push(next)
        } else {
          next()
        }
      } catch (err) {
        next(err)
      }
    }
  })
}

const splitStream = (delimiter: string) => {
  let temp = ''
  return new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, done) {
      const divided = (
        temp + (encoding !== 'utf8' ? Buffer.from(chunk).toString('utf8') : chunk)
      ).split(delimiter)
      temp = divided.pop()
      for (const line of divided) {
        this.push(line)
      }
      done()
    },
    flush(done) {
      temp && this.push(temp)
      done()
    }
  })
}

const bufferStream = <T>(callback: TFilterCallback<T>) => {
  let buffered = []
  let index = 0
  return new ObjectModeTransform({
    transform(chunk: T, _, next) {
      buffered.push(chunk)
      try {
        if (callback(chunk, index++)) {
          this.push(buffered)
          buffered = []
        }
        next()
      } catch (err) {
        next(err)
      }
    },
    flush(next) {
      if (buffered.length) {
        this.push(buffered)
      }
      next()
    }
  })
}

const finalizeStream = (callback: () => any) => {
  return new ObjectModePassThrough({
    async final(next) {
      await callback()
      next()
    }
  })
}
