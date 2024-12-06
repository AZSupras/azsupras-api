"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const typeorm_1 = require("typeorm");
const email_entity_1 = require("./email.entity");
const typeorm_2 = require("@nestjs/typeorm");
const user_service_1 = require("../user/services/user.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(repo, mailerService, configService, userService) {
        this.repo = repo;
        this.mailerService = mailerService;
        this.configService = configService;
        this.userService = userService;
        this.log = new common_1.Logger(EmailService_1.name);
        this.credentials = {
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get('MAIL_PORT'),
            user: this.configService.get('MAIL_USERNAME'),
            pass: this.configService.get('MAIL_PASSWORD'),
        };
        this.sendingEmails = false;
    }
    async _send(mail) {
        try {
            const opts = {
                from: this.configService.get('MAIL_FROM'),
                to: mail.to,
                bcc: this.configService.get('MAIL_BCC_ADDRESS'),
                subject: mail.subject,
                template: mail.template,
                context: mail.context,
            };
            const results = await this.mailerService.sendMail(opts);
            return results;
        }
        catch (error) {
            this.log.error(`Failed to send email: ${error.message}`);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async sendConfirmEmail(mail) {
        this.log.debug(`Sending confirmation email to ${mail.to}`);
        const baseUrl = this.configService.get('API_BASE_URL');
        const user = await this.userService.findEmailVerificationTokenUsername(mail.context.username);
        const confirmLink = `${baseUrl}/auth/confirm-email?token=${user.emailVerificationToken}`;
        if (!confirmLink) {
            throw new Error(`Failed to generate email confirmation link for user ${user.username}`);
        }
        const opts = {
            to: mail.to,
            subject: mail.subject || 'Please Confirm your email address!',
            template: 'confirm_email',
            context: {
                username: user.username,
                firstName: user.firstName,
                confirmLink: confirmLink,
            },
        };
        const results = await this._send(opts);
        return results;
    }
    async sendWelcomeEmail(mail) {
        this.log.debug(`Sending welcome email to ${mail.to}`);
        const opts = {
            to: mail.to,
            subject: mail.subject || 'Welcome to our club!',
            template: 'welcome',
            context: {
                email: mail.to,
                username: mail.context.username,
                firstName: mail.context.firstName,
            },
        };
        const results = await this._send(opts);
        return results;
    }
    async sendNewsletterSubscription(mail) {
        this.log.debug(`Sending newsletter subscription email to ${mail.context.firstName} at ${mail.to}`);
        const baseUrl = this.configService.get('APP_BASE_URL');
        const unsubscribeLink = `${baseUrl}/unsubscribe?email=${mail.to}&token=${mail.context.token}`;
        const opts = {
            to: mail.to,
            subject: "AZSupra's Subscription",
            template: 'newsletter_subscription',
            context: {
                email: mail.to,
                firstName: mail.context.firstName || 'Gordon',
                lastName: mail.context.lastName,
                message: mail.context.message,
                unsubscribeLink: unsubscribeLink,
            },
        };
        const results = await this._send(opts);
        return results;
    }
    async sendPasswordReset(mail) {
        this.log.debug(`Sending password reset email to ${mail.to}`);
        const baseUrl = this.configService.get('APP_BASE_URL');
        const confirmLink = `${baseUrl}/reset-password?token=${mail.context.token}`;
        if (!confirmLink) {
            throw new Error(`Failed to generate password reset email link for user ${mail.context.username}`);
        }
        const opts = {
            to: mail.to,
            subject: mail.subject || 'Reset your password!',
            template: 'password_reset',
            context: {
                ...mail.context,
                confirmLink: confirmLink,
            },
        };
        const results = await this._send(opts);
        return results;
    }
    async sendUnsentEmails() {
        if (this.sendingEmails === true) {
            this.log.debug('Already sending emails');
            return;
        }
        this.sendingEmails = true;
        const unsentEmails = await this.findUnsent();
        if (unsentEmails.length <= 0) {
            this.sendingEmails = false;
            this.log.debug('No unsent emails found');
            return;
        }
        this.log.debug(`Found ${unsentEmails.length} unsent emails`);
        for (const email of unsentEmails) {
            try {
                this.log.debug(`Sending ${email.template} email with id ${email.id} to ${email.to}`);
                await this.setEmailSending(email.id);
                let response = {};
                switch (email.template) {
                    case 'confirm_email':
                        response = await this.sendConfirmEmail(email);
                        break;
                    case 'welcome':
                        response = await this.sendWelcomeEmail(email);
                        break;
                    case 'newsletter_subscription':
                        response = await this.sendNewsletterSubscription(email);
                        break;
                    case 'password_reset':
                        response = await this.sendPasswordReset(email);
                        break;
                    default:
                        break;
                }
                email.response = response;
                email.sent = true;
                email.sending = false;
                email.sentAt = new Date();
                const e = await this.update(email.id, email);
                this.log.debug(`Email with id ${e.id} was sent at ${e.sentAt} to ${e.to}`);
            }
            catch (error) {
                this.log.error(`Failed to send email with id ${email.id}: ${error.message}`);
            }
        }
    }
    async create(newEmail) {
        let email = new email_entity_1.Email();
        email.to = newEmail.to;
        email.subject = newEmail.subject;
        email.context = newEmail.context;
        email.template = newEmail.template;
        email = this.repo.create(email);
        await this.repo.save(email);
        return email;
    }
    async update(id, data) {
        let email = await this.findOne(id);
        if (!email) {
            throw new Error('Email not found');
        }
        email = Object.assign(email, data);
        await this.repo.save(email);
        return email;
    }
    async setEmailSent(id) {
        const email = await this.findOne(id);
        if (!email) {
            throw new Error('Email not found');
        }
        email.sent = true;
        email.sentAt = new Date();
        await this.repo.save(email);
        return email;
    }
    async setEmailSending(id) {
        const email = await this.findOne(id);
        if (!email) {
            throw new Error('Email not found');
        }
        email.sending = true;
        await this.repo.save(email);
        return email;
    }
    async findOne(id) {
        const results = await this.repo.findOne({
            where: {
                id: id,
            },
        });
        return results;
    }
    async findAll() {
        const results = await this.repo.find();
        return results;
    }
    async findSubscribedByEmail(email) {
        const results = await this.repo.findOne({
            where: { to: email, template: 'newsletter_subscription' },
        });
        return results;
    }
    async findAllSubscribedByEmail(email) {
        const results = await this.repo.find({
            where: { to: email, template: 'newsletter_subscription' },
        });
        return results;
    }
    async findAllByEmail(email) {
        const results = await this.repo.find({ where: { to: email } });
        return results;
    }
    async findUnsent() {
        const results = await this.repo.find({
            where: { sent: false, sending: false },
        });
        return results;
    }
    async findSent() {
        const results = await this.repo.find({ where: { sent: true } });
        return results;
    }
    async clearAll() {
        await this.repo.clear();
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(email_entity_1.Email)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        mailer_1.MailerService,
        config_1.ConfigService,
        user_service_1.UserService])
], EmailService);
//# sourceMappingURL=email.service.js.map