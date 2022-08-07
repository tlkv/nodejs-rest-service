import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  constructor(currentLogLevels: LogLevel[]) {
    super();
    this.logLevels = currentLogLevels;
    this.setLogLevels(currentLogLevels); // no real effect
  }

  logLevels: LogLevel[];

  log(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('log')) return;
    super.log.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'LOG_COMMON');
  }

  error(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('error')) return;
    super.error.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'LOG_ERRORS');
  }

  warn(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('warn')) return;
    super.warn.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'LOG_COMMON');
  }

  debug(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('debug')) return;
    super.debug.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'LOG_COMMON');
  }

  verbose(message: string, ...optionalParams: string[]) {
    if (!this.logLevels.includes('verbose')) return;
    super.verbose.apply(this, [`${message}`, optionalParams.join(' ')]);
    this.writeToFile(message, 'LOG_COMMON');
  }

  writeToFile(message: string, type: string) {
    if (fs.existsSync(`${type.toUpperCase()}.log`)) {
      fs.appendFileSync(`${type.toUpperCase()}.log`, message + '\n');
    } else {
      fs.writeFileSync(`${type.toUpperCase()}.log`, message + '\n');
    }
  }
}
