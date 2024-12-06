import { AuthService } from '../auth.service';
import { IUser } from 'src/user/dto/user-profile.dto';
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(identity: string, password: string): Promise<IUser>;
}
export {};
