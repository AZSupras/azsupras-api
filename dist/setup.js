"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const cookieParser = require("cookie-parser");
const connect_redis_1 = require("connect-redis");
const session = require("express-session");
const redis_1 = require("redis");
const passport = require("passport");
const connectPgSimple = require("connect-pg-simple");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
function setup(app) {
    const config = app.get(config_1.ConfigService);
    const appSecret = config.get('APP_SECRET');
    const nodeEnv = config.get('NODE_ENV');
    const redisHost = config.get('REDIS_HOST') || 'localhost';
    const redisPort = config.get('REDIS_PORT') || 6379;
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
    }));
    app.use(cookieParser(appSecret));
    const redisSessionClient = (0, redis_1.createClient)({
        url: `redis://${redisHost}:${redisPort}`,
        database: 0,
        name: 'session',
    });
    redisSessionClient.connect()
        .then(() => {
        console.log('Redis session client connected');
    })
        .catch(console.error);
    const sessionStore = (nodeEnv === 'production')
        ? new (connectPgSimple(session))({
            conString: config.get('DATABASE_URL'),
            createTableIfMissing: true,
        })
        : new connect_redis_1.RedisStore({
            client: redisSessionClient,
        });
    app.use(session({
        secret: appSecret,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            signed: true,
            sameSite: 'strict',
            secure: nodeEnv === 'production',
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
        credentials: true,
        exposedHeaders: ['Authorization'],
    });
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    return app;
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map