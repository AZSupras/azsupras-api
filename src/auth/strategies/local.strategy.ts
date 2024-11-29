import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { IUser } from 'src/user/dto/user-profile.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'identity',
      passReqToCallback: false,
    });
  }

  async validate(identity: string, password: string): Promise<IUser> {
    const result: IUser = await this.authService.login(identity, password);

    if (!result) {
      return null;
    }
    
    return result;
  }
}