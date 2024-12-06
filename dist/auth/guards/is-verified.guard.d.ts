import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IsVerifiedGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
