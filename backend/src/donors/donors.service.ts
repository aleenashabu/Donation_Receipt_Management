import { Injectable , NotFoundException} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateDonorDto } from './dto/create-donor.dto.js';
import { UpdateDonorDto } from './dto/update-donor.dto.js';


@Injectable()
export class DonorsService {
    async findAll() {
     return db.orm.public.Donor.all();
  }

    async create(createDonorDto: CreateDonorDto) {
     return db.orm.public.Donor.create(createDonorDto);
  }

   async update(id: number, updateDonorDto: UpdateDonorDto) {
    return db.orm.public.Donor
      .where({ id })
      .update(updateDonorDto);
  }

  async findOne(id: number) {
  const donor = await db.orm.public.Donor
    .where({ id })
    .first();

  if (!donor) {
    throw new NotFoundException('Donor not found');
  }

  return donor;
}

async deactivate(id: number) {
  return db.orm.public.Donor
    .where({ id })
    .update({
      isActive: false,
    });
}

}
