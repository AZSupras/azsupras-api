import { HealthCheckResult, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private health;
    private orm;
    private memory;
    constructor(health: HealthCheckService, orm: TypeOrmHealthIndicator, memory: MemoryHealthIndicator);
    check(): Promise<HealthCheckResult>;
}
