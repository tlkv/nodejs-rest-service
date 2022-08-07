import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();
const MAX_LOGS_SIZE = process.env.MAX_LOGS_SIZE || 2000;
@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService extends ConsoleLogger {
  constructor(currentLogLevels: LogLevel[]) {
    super();
    this.logLevels = currentLogLevels;
    this.setLogLevels(currentLogLevels);
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
    const logFileName = `${type.toUpperCase()}.log`;
    if (fs.existsSync(logFileName)) {
      const stats = fs.statSync(logFileName);
      const fileSize = Math.round(stats.size / 1024);
      if (fileSize < MAX_LOGS_SIZE) {
        fs.appendFileSync(logFileName, message + '\n', 'utf-8');
      } else {
        fs.writeFileSync(logFileName, message + '\n', 'utf-8');
      }
    } else {
      fs.writeFileSync(logFileName, message + '\n', 'utf-8');
    }
  }
}
