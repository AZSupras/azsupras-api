"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("./logger/logger.service");
const app_module_1 = require("./app.module");
const setup_1 = require("./setup");
const swagger_1 = require("@nestjs/swagger");
const data_1 = require("./seeder/data");
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
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Arizona Supra\'s Api')
        .setDescription('The Arizona Supra\'s Api description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/swagger', app, documentFactory, {
        jsonDocumentUrl: 'api/swagger/json',
    });
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
    const { username, password, ...defaultAdminUser } = data_1.SeedData.users[0];
    setTimeout(() => {
        logger.printStartupBanner(apiBaseUrl, username, password);
    }, 500);
});
//# sourceMappingURL=main.js.map