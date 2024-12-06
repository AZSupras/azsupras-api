import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
