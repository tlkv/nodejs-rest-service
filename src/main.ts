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
    //logger: ,
    //logger: ['log', 'error', 'warn', 'debug', 'verbose'], // 'log', 'error', 'warn', 'debug', and 'verbose'.
  });
  const configService = app.get(ConfigService);
  // console.log('cService', configService.get());
  // add config
  app.useLogger(new LoggingService());
  const rootDirname = dirname(__dirname);
  const API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(API);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
