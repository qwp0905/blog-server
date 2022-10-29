import { DataSource } from 'typeorm'
import { DataSourceOptions } from 'typeorm'

export const TypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['{dist/**/*.entity.js,src/**/*.entity.ts}'],
  entitySkipConstructor: true,
  synchronize: false
}

export const DATABASE = new DataSource(TypeOrmConfig)
