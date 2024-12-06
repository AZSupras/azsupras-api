import { Injectable } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { User } from "./entities/user.entity";
import { eachOfSeries } from "async";
import { LoggerService } from "src/logger/logger.service";

@Injectable()
export class UserProcessor {
    private readonly logger = new LoggerService(UserProcessor.name);

    constructor(
        private readonly userService: UserService,
    ) {}

    // set users to verified
    @Cron(CronExpression.EVERY_10_MINUTES)
    async every10Minutes() {
        await this._verifyUsers();
    }

    private async _verifyUsers() {
        const users: User[] = await this.userService.find({
            where: {
                isVerified: false,
                isBanned: false,
                emailVerified: true,
            },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                emailVerified: true,
            }
        });

        if (users.length === 0) {
            this.logger.debug('No users to verify.');
            return;
        }
        
        this.logger.debug(`Verifying ${users.length} users`);

        eachOfSeries(users, async (user: User, k: number) => {
            this.logger.debug(`Verifying user ${user.username} ${k + 1} of ${users.length}`);
            if (user.emailVerified && user.firstName && user.lastName) {
                user.isVerified = true;
                user = await this.userService.update(user.username, user);
                return;
            }
        }, (err: any) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            } else {
                this.logger.debug('all users verified');
            }
        });
    }
}