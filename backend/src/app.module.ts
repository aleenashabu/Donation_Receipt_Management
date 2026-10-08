import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DonorsModule } from './donors/donors.module.js';
import { DonationsModule } from './donations/donations.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ReceiptModule } from './receipt/receipt.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DonorsModule,
    DonationsModule,
    DashboardModule,
    ReceiptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
