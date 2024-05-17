import {
  Injectable,
  LoggerService as _LoggerService,
  Scope,
  ConsoleLogger,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements _LoggerService {
  debug(message: any, context?: string, ...optionalParams: any[]) {
    const contextString = context ? `[${context}] ` : '';
    console.debug(`[DEBUG] ${contextString}${message}`, ...optionalParams);
  }

  verbose(message: any, context?: string, ...optionalParams: any[]) {
    const contextString = context ? `[${context}] ` : '';
    console.log(`[VERBOSE] ${contextString}${message}`, ...optionalParams);
  }
}
