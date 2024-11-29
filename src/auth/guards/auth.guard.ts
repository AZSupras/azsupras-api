import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../auth.constants';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      if (!request.user) {
        throw new UnauthorizedException();
      }

      return true;
    }
  }