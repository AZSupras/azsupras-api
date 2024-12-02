import { CanActivate, ExecutionContext, Injectable, MethodNotAllowedException } from "@nestjs/common";


@Injectable()
export class IsGuestGuard implements CanActivate {  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      throw new MethodNotAllowedException('You are already logged in')
    }

    return true;
  }
}