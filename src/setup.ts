import { ValidationPipe, HttpStatus, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

export function setup(app: INestApplication): INestApplication {
  const config = app.get(ConfigService);
  const appSecret: string = config.get<string>('APP_SECRET');
  const nodeEnv: string = config.get<string>('NODE_ENV');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(cookieParser(appSecret));

  const sessionStore = (nodeEnv === 'production')
    ? new (connectPgSimple(session))()
    : new session.MemoryStore();
    
  app.use(
    session({
      secret: appSecret as string,
      resave: false,
      saveUninitialized: false,
      store: new (connectPgSimple(session))({
        conString: config.get<string>('DATABASE_URL'),
        createTableIfMissing: true,
      }),
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