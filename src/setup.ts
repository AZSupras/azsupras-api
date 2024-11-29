import { ValidationPipe, HttpStatus, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import {RedisStore} from "connect-redis"
import * as session from "express-session"
import {createClient} from "redis"
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

export function setup(app: INestApplication): INestApplication {
  const config = app.get(ConfigService);
  const appSecret: string = config.get<string>('APP_SECRET');
  const nodeEnv: string = config.get<string>('NODE_ENV');
  const redisHost: string = config.get<string>('REDIS_HOST') || 'localhost';
  const redisPort: number = config.get<number>('REDIS_PORT') || 6379;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(cookieParser(appSecret));

  const redisSessionClient = createClient({
    url: `redis://${redisHost}:${redisPort}`,
    database: 0,
    name: 'session',
  })
  redisSessionClient.connect()
    .then(() => {
      console.log('Redis session client connected');
    })
    .catch(console.error);

  const sessionStore = (nodeEnv === 'production')
    ? new (connectPgSimple(session))({
      conString: config.get<string>('DATABASE_URL'),
      createTableIfMissing: true,
    })
    : new RedisStore({
      client: redisSessionClient,
    });
    // : new session.MemoryStore();

  app.use(
    session({
      secret: appSecret as string,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: nodeEnv === 'production',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}