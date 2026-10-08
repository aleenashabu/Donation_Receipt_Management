import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { db } from '../prisma/db.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';

type DonationStatus =
  | 'RECEIVED'
  | 'PENDING'
  | 'CANCELLED'
  | 'REFUNDED';

type PaymentMethod =
  | 'CASH'
  | 'CHEQUE'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'BANK_TRANSFER'
  | 'ONLINE'
  | 'OTHER';

@Injectable()
export class DonationsService {
  async findAll(filters: {
    donorId?: string;
    status?: string;
    paymentMethod?: string;
    from?: string;
    to?: string;
  }) {
    let query = db.orm.public.Donation;

    if (filters.donorId) {
      query = query.where({
        donorId: Number(filters.donorId),
      });
    }

    if (filters.status) {
      query = query.where({
        status: filters.status as DonationStatus,
      });
    }

    if (filters.paymentMethod) {
      query = query.where({
        paymentMethod: filters.paymentMethod as PaymentMethod,
      });
    }

    if (filters.from) {
      query = query.where((donation) =>
        donation.donationDate.gte(filters.from!),
      );
    }

    if (filters.to) {
      query = query.where((donation) =>
        donation.donationDate.lte(filters.to!),
      );
    }

    return query.all();
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