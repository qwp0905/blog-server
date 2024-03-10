import * as crypto from 'crypto'

interface Constructor<T = any> {
  new (...args: any[]): T
}

export class Container {
  private static dependencies = new Map()
  private static implementations = new Map()
  private static providers = new Map()

  static register(Class: Constructor, dependencies = []) {
    this.dependencies.set(createHash(Class), dependencies)
  }

  static provide(provider: Provider) {
    this.providers.set(createHash(provider.provide), provider)
  }

  private static async generate(t: Constructor | string) {
    const key = createHash(t)
    const exists = this.implementations.get(key)
    if (exists) {
      return exists
    }

    const provider: Provider = this.providers.get(key)
    if (provider) {
      if ('useValue' in provider) {
        this.implementations.set(key, provider.useValue)
        return provider.useValue
      }

      if ('useClass' in provider) {
        const impl = await this.generate(provider.useClass)
        this.implementations.set(key, impl)
        return impl
      }

      const dependencyImpl = []
      for (const sub of provider.inject || []) {
        dependencyImpl.push(await this.generate(sub))
      }

      const impl = await provider.useFactory(...dependencyImpl)
      this.implementations.set(key, impl)
      return impl
    }

    const dependencies = this.dependencies.get(key)
    if (!dependencies) {
      throw new Error(`${t.toString()} not registered`)
    }

    const dependencyImpl = []
    for (const sub of dependencies) {
      dependencyImpl.push(await this.new(sub))
    }

    const impl = new (t as Constructor)(...dependencyImpl)
    this.implementations.set(key, impl)
    return impl
  }

  static async new<T>(Class: Constructor<T>): Promise<T> {
    const app = await this.generate(Class)
    this.dependencies.clear()
    this.providers.clear()
    return app
  }
}

function createHash(Class: Constructor | string) {
  return crypto.createHash('sha256').update(Class.toString()).digest('base64')
}

export type Provider<T = any> = ClassProvider<T> | FactoryProvider<T> | ValueProvider<T>

interface ProvideKey {
  provide: string
}

interface ClassProvider<T> extends ProvideKey {
  useClass: Constructor<T>
}

interface FactoryProvider<T> extends ProvideKey {
  inject?: string | Constructor[]
  useFactory(...args: any[]): T | Promise<T>
}

interface ValueProvider<T> extends ProvideKey {
  useValue: T
}
