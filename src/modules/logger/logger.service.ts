/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  constructor(configService: ConfigService) {
    super();
    const level = configService.get('LOGS_LEVEL');
    console.log('thisLevel', level);
    const logLevels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];

    console.log('newLogLevs', logLevels.slice(0, +level + 1));

    this.setLogLevels(logLevels.slice(0, +level + 1));
    //const;
  }

  //  constructor(private config: ConfigService) {
  log(message: string, ...optionalParams: string[]) {
    super.log.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: string, ...optionalParams: string[]) {
    super.error.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: string, ...optionalParams: string[]) {
    super.warn.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: string, ...optionalParams: string[]) {
    super.debug.apply(this, [`${message}`, optionalParams.join(' ')]);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: string, ...optionalParams: string[]) {
    super.verbose.apply(this, [`${message}`, optionalParams.join(' ')]);
  }
  /**
   * Write an 'error' level log.
   */
}
