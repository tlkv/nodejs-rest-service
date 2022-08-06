import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggingService } from './modules/logger/logger.service';
import { ConfigService } from '@nestjs/config';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    /*     logger: ['error'], */
  });
  const configService = app.get(ConfigService);
  app.useLogger(new LoggingService(configService));

  const loggingService = new LoggingService(configService);
  loggingService.setContext('app');

  process
    .on('uncaughtException', (err) => {
      loggingService.warn(`Uncaught exception: ${err.message}`, 'app');
    })
    .on('unhandledRejection', (err: Error) => {
      loggingService.warn(`Unhandled rejection: ${err.message}`, 'app');
    });

  const rootDirname = dirname(__dirname);
  const API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(API);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  loggingService.log('log', 'app', '11');
  loggingService.verbose('verbose', 'app', '11');
  loggingService.debug('debug', 'app', '11');
  loggingService.warn('warn', 'app', '11');
  loggingService.error('error', 'app', '11');

  try {
    const xxx = await fetch('www.google.com');
  } catch {
    console.log('rej');
  }
  //const xxx = await fetch('www.google.com');

  console.log('level', configService.get<number>('LOGS_LEVEL'));
}
bootstrap();
