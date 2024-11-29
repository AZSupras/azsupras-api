import {
  Injectable,
  LoggerService as _LoggerService,
  Scope,
  ConsoleLogger,
  LogLevel,
  ConsoleLoggerOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements _LoggerService {
  private readonly configService: ConfigService = new ConfigService();

  constructor(context: string, options?: ConsoleLoggerOptions) {
    super(context, {
      ...options,
    });

    const logLevels: LogLevel[] = this.configService.get<string>('LOG_LEVELS')?.split(',') as LogLevel[] || ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'];
    
    if (!this.options) {
      this.options = {};
    }

    this.options.logLevels = logLevels;
  }

  printStartupBanner(apiUrl: string, adminUser: string, adminPassword: string) {
    const padString = (str: string, length: number) => str.padEnd(length, ' ');
    
    const maxLength = Math.max(apiUrl.length, adminUser.length, adminPassword.length);
    const totalLength = maxLength + 24; // Adjust this value as needed for padding and labels
  
    const paddedApiUrl = padString(apiUrl, totalLength - 16);
    const paddedAdminUser = padString(adminUser, totalLength - 22);
    const paddedAdminPassword = padString(adminPassword, totalLength - 26);
  
    const startupBannerArray: string[] = [];
    startupBannerArray.push('#'.repeat(totalLength));
console.log(`
  ######################################################
  #                                                    #
  #                API STARTED SUCCESSFULLY            #
  #                                                    #
  ######################################################
  #                                                    #
  #  API Base URL: ${paddedApiUrl}#
  #  Default Admin User: ${paddedAdminUser}#
  #  Default Admin Password: ${paddedAdminPassword}#
  #                                                    #
  ######################################################
`);
  }
}
