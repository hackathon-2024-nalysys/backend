import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as session from 'express-session';
import { config } from 'dotenv';
import RedisStore from 'connect-redis';
import * as redis from 'redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as express from 'express';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });

  app.set('trust proxy', 1);
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
      }),
      cookie: {
        secure: false,
      },
    }),
  );
  app.use('/assets', express.static('assets'));

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      credentials: true,
    }),
  );

  await redisClient.connect();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
