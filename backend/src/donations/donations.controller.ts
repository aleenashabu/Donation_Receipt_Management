import { Body, Controller, Post , Get , Param ,Patch } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { DonationsService } from './donations.service.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}


  @Get()
async findAll() {
  return this.donationsService.findAll();
}

@Get(':id')
async findOne(@Param('id') id: string) {
  return this.donationsService.findOne(Number(id));
}

@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateDonationDto: UpdateDonationDto,
) {
  return this.donationsService.update(
    Number(id),
    updateDonationDto,
  );
}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }
}