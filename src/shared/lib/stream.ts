import { Stream, Transform } from 'stream'

type TFilterCallback<T> = (arg: T, index?: number) => boolean | Promise<boolean>
type TMapCallback<T, R> = (arg: T, index?: number) => R | Promise<R>
type TTapCallback<T> = (arg: T, index?: number) => void | Promise<void>
type TReduceCallback<A, C> = (acc: A, cur: C, index?: number) => A | Promise<A>

export class StreamObject<T = any> {
  constructor(private stream: Stream) {}

  getStream() {
    return this.stream
  }

  toPromise() {
    return new Promise<T>((res, rej) => {
      let result: T
      this.stream.on('data', (chunk: T) => {
        result = chunk
      })

      this.stream.on('error', (err) => rej(err))

      this.stream.on('end', () => res(result))
    })
  }

  toArray() {
    return new Promise<T[]>((res, rej) => {
      const result: T[] = []
      this.stream.on('data', (chunk: T) => {
        result.push(chunk)
      })

      this.stream.on('error', (err) => rej(err))

      this.stream.on('end', () => res(result))
    })
  }

  filter(callback: TFilterCallback<T>) {
    return fromStream<T>(this.stream.pipe(filterStream(callback)))
  }

  map<R = T>(callback: TMapCallback<T, R>) {
    return fromStream<R>(this.stream.pipe(mapStream<T, R>(callback)))
  }

  tap(callback: TTapCallback<T>) {
    return fromStream<T>(this.stream.pipe(tapStream<T>(callback)))
  }

  reduce<A = T>(callback: TReduceCallback<A, T>, initialValue: A) {
    return fromStream<A>(this.stream.pipe(reduceStream<A, T>(callback, initialValue)))
  }

  skip(num: number) {
    return fromStream<T>(this.stream.pipe(skipStream(num)))
  }

  take(num: number) {
    return fromStream<T>(this.stream.pipe(takeStream(num)))
  }
}

export const fromStream = <T = any>(stream: Stream) => new StreamObject<T>(stream)

export const filterStream = <T>(callback: TFilterCallback<T>) => {
  let index = 0

  return new Transform({
    objectMode: true,
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

export const tapStream = <T>(callback: TTapCallback<T>) => {
  let index = 0

  return new Transform({
    objectMode: true,
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

export const reduceStream = <A, C>(callback: TReduceCallback<A, C>, initialValue: A) => {
  let index = 0

  return new Transform({
    objectMode: true,
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

export const mapStream = <T, R>(callback: TMapCallback<T, R>) => {
  let index = 0

  return new Transform({
    objectMode: true,
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

export const skipStream = (num: number) => {
  let index = 0

  return new Transform({
    objectMode: true,
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

export const takeStream = (num: number) => {
  let index = 0

  return new Transform({
    objectMode: true,
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
