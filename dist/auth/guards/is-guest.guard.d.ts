import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class IsGuestGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
