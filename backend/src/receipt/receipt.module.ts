import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller.js';
import { ReceiptService } from './receipt.service.js';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService]
})
export class ReceiptModule {}
