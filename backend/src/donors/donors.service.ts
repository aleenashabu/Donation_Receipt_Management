import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getDetails(id: number) {
    const donor = await db.orm.public.Donor
      .where({ id })
      .first();

    if (!donor) {
      throw new NotFoundException('Donor not found');
    }

    const donations = await db.orm.public.Donation
      .where({ donorId: id })
      .all();

    const donationHistory = await Promise.all(
      donations.map(async (donation) => {
        const fund = await db.orm.public.Fund
          .where({ id: donation.fundId })
          .first();

        return {
          id: donation.id,
          donationDate: donation.donationDate,
          amount: donation.amount,
          fund: fund?.name ?? 'Unknown',
          status: donation.status,
        };
      }),
    );

    const totalReceived = donations
      .filter((donation) => donation.status === 'RECEIVED')
      .reduce(
        (total, donation) => total + Number(donation.amount),
        0,
      );

    return {
      donor,
      totalReceived: totalReceived.toFixed(2),
      donations: donationHistory,
    };
  }

  async deactivate(id: number) {
    return db.orm.public.Donor
      .where({ id })
      .update({
        isActive: false,
      });
  }
}