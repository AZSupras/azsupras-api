import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IsAuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
