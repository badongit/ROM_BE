import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['dist/components/*/entities/*.entity.js'],
  subscribers: [],
  migrations: ['dist/migrations/*'],
  migrationsRun: false,
  ssl:
    process.env.DATABASE_SSL !== 'false'
      ? process.env.CA_CERT
        ? {
            rejectUnauthorized: true,
            ca: process.env.CA_CERT,
          }
        : {
            rejectUnauthorized: false,
          }
      : false,
  namingStrategy: new SnakeNamingStrategy(),
});

export default AppDataSource;
