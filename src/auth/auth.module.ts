import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { BullModule } from '@nestjs/bull';
import { AppConfigModule } from '@/app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer,],
})
export class AuthModule {}