import { DataSourceOptions } from 'typeorm'

export const TypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  entities: ['{dist/**/*.entity.js,src/**/*.entity.ts}'],
  entitySkipConstructor: true,
  synchronize: true,
  replication: {
    master: {
      host: process.env.DATABASE_HOST_MASTER,
      port: +process.env.DATABASE_PORT_MASTER,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    slaves: [
      {
        host: process.env.DATABASE_HOST_SLAVE,
        port: +process.env.DATABASE_PORT_SLAVE,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
      }
    ]
  }
}
