import { Injectable ,  NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { db } from '../prisma/db.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';

@Injectable()
export class DonationsService {

    async findAll() {
  return db.orm.public.Donation.all();
}

 async findOne(id: number) {
    const donation = await db.orm.public.Donation
      .where({ id })
      .first();

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const donor = await db.orm.public.Donor
      .where({ id: donation.donorId })
      .first();

    return {
      donation,
      donor,
    };
  }


  async update(id: number, updateDonationDto: UpdateDonationDto) {
  return db.orm.public.Donation
    .where({ id })
    .update(updateDonationDto);
}

    async create(createDonationDto: CreateDonationDto) {
  return db.orm.public.Donation.create(createDonationDto);
}


}
