import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

ConfigModule.forRoot({
  isGlobal: true,
})

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.ORMCONFIG_HOST}`,
  port: 5432,
  username: `${process.env.ORMCONFIG_USERNAME}`,
  password: `${process.env.ORMCONFIG_PASSWORD}`,
  database: `${process.env.ORMCONFIG_DATABASE}`,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: true
};

export default config;
