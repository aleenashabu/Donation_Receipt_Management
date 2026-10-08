import { Body, Controller, Get, Param, Post , Query , Patch } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';
import { CreateReceiptDto } from './dto/create-receipt.dto.js';

@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Get()
async findAll(
  @Query('status') status?: string,
  @Query('donorId') donorId?: string,
  @Query('year') year?: string,
  @Query('date') date?: string,


) {
  return this.receiptService.findAll(
    status,
    donorId ? Number(donorId) : undefined,
    year ? Number(year) : undefined,
    date,

  );
}

@Get('dashboard')
async getDashboard() {
  return this.receiptService.getDashboard();
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.receiptService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptService.create(createReceiptDto);
  }

  @Patch(':id/void')
async voidReceipt(@Param('id') id: string) {
  return this.receiptService.voidReceipt(Number(id));
}

@Post(':id/replace')
async replaceReceipt(
  @Param('id') id: string,
  @Body() body: { createdById: number },
) {
  return this.receiptService.replaceReceipt(
    Number(id),
    body.createdById,
  );
}
}