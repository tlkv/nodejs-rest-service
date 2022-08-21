import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { LoggingService } from './modules/logger/logger.service';
import { ConfigService } from '@nestjs/config';

const PORT = process.env.PORT || 4000;

export const MAX_LOGS_LEVEL = 4;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const level = configService.get('LOGS_LEVEL') || MAX_LOGS_LEVEL;
  const logLevels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];
  const currentLogLevels: LogLevel[] = logLevels.slice(0, +level + 1);
  app.useLogger(new LoggingService(currentLogLevels));

  process
    .on('uncaughtException', (err) => {
      Logger.error(`Uncaught exception: ${err.message}`, 'ExceptionsLogger');
    })
    .on('unhandledRejection', (err: Error) => {
      Logger.error(`Unhandled rejection: ${err.message}`, 'ExceptionsLogger');
    });

  const rootDirname = dirname(__dirname);
  const API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(API);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log(`\nCurrent LOGS_LEVEL is ${level} - [${currentLogLevels}]\n`);
}
bootstrap();
