import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from "@nestjs/terminus";
import { InjectDataSource } from "@nestjs/typeorm";

import dataSource from "@vcs/adapter/data/config/data-source";

import { DataSource } from "typeorm";

@Controller("health")
export class HealthController {
  constructor(
    @InjectDataSource(dataSource)
    private readonly tbmpDataSource: DataSource,
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.db.pingCheck(dataSource.name, { connection: this.tbmpDataSource }),
    ]);
  }
}
