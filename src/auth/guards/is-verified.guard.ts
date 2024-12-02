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
  export class IsVerifiedGuard implements CanActivate {  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user || !user.emailVerified) {
        throw new UnauthorizedException('Only verified users are authorized to access this resource.');
      }

      return true;
    }
  }