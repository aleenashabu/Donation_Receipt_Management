import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('monthly-summary')
async getMonthlySummary() {
  return this.dashboardService.getMonthlySummary();
}
}