import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggingService } from './modules/logger/logger.service';
import { ConfigService } from '@nestjs/config';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const level = configService.get('LOGS_LEVEL') || 4;
  const logLevels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];
  const currentLogLevels: LogLevel[] = logLevels.slice(0, +level + 1);
  console.log(`Current log level is ${level} - `, currentLogLevels);

  app.useLogger(new LoggingService(currentLogLevels));

  const loggingService = new LoggingService(currentLogLevels);
  loggingService.setContext('app');

  process
    .on('uncaughtException', (err) => {
      loggingService.error(`Uncaught exception: ${err.message}`, 'app');
    })
    .on('unhandledRejection', (err: Error) => {
      loggingService.error(`Unhandled rejection: ${err.message}`, 'app');
    });

  const rootDirname = dirname(__dirname);
  const API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(API);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
