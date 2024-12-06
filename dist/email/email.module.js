"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const typeorm_1 = require("@nestjs/typeorm");
const email_entity_1 = require("./email.entity");
const email_controller_1 = require("./email.controller");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const email_processor_1 = require("./email.processor");
const subscriber_service_1 = require("../subscriber/subscriber.service");
const subscriber_entity_1 = require("../subscriber/subscriber.entity");
const hash_service_1 = require("../hash/hash.service");
const user_module_1 = require("../user/user.module");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_entity_1.Email, subscriber_entity_1.Subscriber]),
            config_1.ConfigModule,
            mailer_1.MailerModule,
            user_module_1.UserModule,
            bull_1.BullModule.registerQueue({
                name: 'email',
            }),
        ],
        providers: [email_service_1.EmailService, subscriber_service_1.SubscriberService, hash_service_1.HashService, email_processor_1.EmailProcessor],
        exports: [email_service_1.EmailService, typeorm_1.TypeOrmModule],
        controllers: [email_controller_1.EmailController],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map