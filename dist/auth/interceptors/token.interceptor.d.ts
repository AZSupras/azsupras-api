import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
export declare class TokenInterceptor implements NestInterceptor {
    private readonly authService;
    constructor(authService: AuthService);
    intercept(context: ExecutionContext, next: CallHandler<User>): Observable<User>;
}
