import { Body, Controller, Get, Post,Param,Patch,Query } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto.js';
import { UpdateDonorDto } from './dto/update-donor.dto.js';
import { DonorsService } from './donors.service.js';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  async findAll() {
    return this.donorsService.findAll();
  }

  @Post()
  async create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

   @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDonorDto: UpdateDonorDto,
  ) {
    return this.donorsService.update(Number(id), updateDonorDto);
  }


 @Get(':id')
async findOne(@Param('id') id: string) {
  return this.donorsService.findOne(Number(id));
}

@Get(':id/details')
async getDetails(@Param('id') id: string) {
  return this.donorsService.getDetails(Number(id));
}


@Patch(':id/deactivate')
async deactivate(@Param('id') id: string) {
  return this.donorsService.deactivate(Number(id));
}

}