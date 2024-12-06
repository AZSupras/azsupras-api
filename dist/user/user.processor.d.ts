import { UserService } from "./services/user.service";
export declare class UserProcessor {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    every10Minutes(): Promise<void>;
    private _verifyUsers;
}
