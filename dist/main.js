"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("./logger/logger.service");
const app_module_1 = require("./app.module");
const SeederData_1 = require("./seeder/SeederData");
const setup_1 = require("./setup");
const logger = new logger_service_1.LoggerService('Main');
async function bootstrap() {
    const applicationOptions = {
        cors: {
            origin: 'http://localhost:4000',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        },
        bufferLogs: true,
        logger: logger,
    };
    const app = await core_1.NestFactory.create(app_module_1.AppModule, applicationOptions);
    const config = app.get(config_1.ConfigService);
    const apiHost = config.get('API_HOST') || 'localhost';
    const apiPort = config.get('API_PORT') || 3000;
    const apiPrefix = config.get('API_PREFIX');
    (0, setup_1.setup)(app);
    app.setGlobalPrefix(apiPrefix);
    await app.listen(apiPort, apiHost);
    return {
        app,
        apiBaseUrl: `http://${apiHost}:${apiPort}/${apiPrefix}`
    };
}
bootstrap()
    .then(({ app, apiBaseUrl }) => {
    const { username, password, ...defaultAdminUser } = SeederData_1.SeedData_Users[0];
    setTimeout(() => {
        logger.printStartupBanner(apiBaseUrl, username, password);
    }, 500);
});
//# sourceMappingURL=main.js.map