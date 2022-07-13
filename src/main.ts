import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { readFile } from 'fs/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rootDirname = dirname(__dirname);
  const API = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  const document = parse(API);
  SwaggerModule.setup('doc', app, document);
  await app.listen(4000);
}
bootstrap();
