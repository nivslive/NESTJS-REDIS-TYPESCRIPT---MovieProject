import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'moviesdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    MoviesModule,
  ],
})
export class AppModule {}
