/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  constructor(currentLogLevels: LogLevel[]) {
    super();
    /*   const level = configService.get('LOGS_LEVEL');
    const logLevels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];
    const currentLogLevels: LogLevel[] = logLevels.slice(0, +level + 1); */
    this.logLevels = currentLogLevels;
    this.setLogLevels(currentLogLevels); //
  }

  logLevels: LogLevel[];

  //  constructor(private config: ConfigService) {
  log(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('log')) return;
    super.log.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  error(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('error')) return;
    super.error.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  warn(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('warn')) return;
    super.warn.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  debug(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('debug')) return;
    super.debug.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  verbose(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('verbose')) return;
    super.verbose.apply(this, [`${message}`, optionalParams.join(' ')]);
  }
}
