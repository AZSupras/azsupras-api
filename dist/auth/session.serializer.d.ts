import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
export declare class SessionSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error | null, id?: User) => void): void;
    deserializeUser(payload: unknown, done: (err: Error | null, payload?: unknown) => void): void;
}
