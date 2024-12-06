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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const subscriber_service_1 = require("../subscriber/subscriber.service");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    constructor(emailService, subscriberService) {
        this.emailService = emailService;
        this.subscriberService = subscriberService;
        this.log = new common_1.Logger(EmailProcessor_1.name);
    }
    async sendEmail(job) {
        this.log.debug(`Processing job ${job.id}`);
        const createEmailDto = job.data;
        let response = undefined;
        let email = await this.emailService.findSubscribedByEmail(createEmailDto.to);
        if (email) {
            this.log.debug(`Email with id ${email.id} already sent at ${email.sentAt} to ${email.to}`);
            return;
        }
        email = await this.emailService.create(createEmailDto);
        switch (job.data.template) {
            case 'confirm_email':
                response = await this.emailService.sendConfirmEmail(job.data);
                break;
            case 'welcome':
                response = await this.emailService.sendWelcomeEmail(job.data);
                break;
            case 'newsletter_subscription':
                response = await this.emailService.sendNewsletterSubscription(job.data);
                break;
            case 'password_reset':
                response = await this.emailService.sendPasswordReset(job.data);
                break;
            default:
                break;
        }
        email.response = response;
        email.sent = true;
        email.sentAt = new Date();
        const e = await this.emailService.update(email.id, email);
        this.log.debug(`Email with id ${e.id} was sent at ${e.sentAt} to ${e.to}`);
        let subscriber = await this.subscriberService.findOneByEmail(email.to);
        if (!subscriber) {
            throw new Error('No subscriber found');
        }
        subscriber.subscribeEmailSentAt = email.sentAt;
        subscriber = await this.subscriberService.update(subscriber.id, subscriber);
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "sendEmail", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bull_1.Processor)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        subscriber_service_1.SubscriberService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map