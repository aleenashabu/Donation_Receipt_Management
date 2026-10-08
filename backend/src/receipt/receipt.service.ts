import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateReceiptDto } from './dto/create-receipt.dto.js';

@Injectable()
export class ReceiptService {
  async findOne(id: number) {
    const receipt = await db.orm.public.Receipt
      .where({ id })
      .first();

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    return receipt;
  }

  async create(createReceiptDto: CreateReceiptDto) {
    const { donationId, createdById } = createReceiptDto;

    const donation = await db.orm.public.Donation
      .where({ id: donationId })
      .first();

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const existingReceipt = await db.orm.public.Receipt
      .where({ donationId })
      .first();

    if (existingReceipt) {
      throw new ConflictException(
        'This donation already has a receipt',
      );
    }

    return db.orm.public.Receipt.create({
      donationId,
      createdById,
    });
  }

  async voidReceipt(id: number) {
  const receipt = await db.orm.public.Receipt
    .where({ id })
    .first();

  if (!receipt) {
    throw new NotFoundException('Receipt not found');
  }

  if (receipt.status !== 'ISSUED') {
    throw new ConflictException(
      'Only an issued receipt can be voided',
    );
  }

  return db.orm.public.Receipt
    .where({ id })
    .update({
      status: 'VOID',
    });
}

async replaceReceipt(id: number, createdById: number) {
  const originalReceipt = await db.orm.public.Receipt
    .where({ id })
    .first();

  if (!originalReceipt) {
    throw new NotFoundException('Receipt not found');
  }

  if (originalReceipt.status !== 'VOID') {
    throw new ConflictException(
      'Only a void receipt can be replaced',
    );
  }

  

  return db.orm.public.Receipt.create({
    donationId: originalReceipt.donationId,
    replacedReceiptId: originalReceipt.id,
    createdById,
  });
}

  async findAll(
    status?: string,
    donorId?: number,
    year?: number,
    date?: string,
  ) {
    let query = db.orm.public.Receipt;

    if (status) {
      query = query.where({
        status: status as 'ISSUED' | 'VOID' | 'REPLACED',
      });
    }


    let receipts = await query.all();

    if (donorId) {
      const donations = await db.orm.public.Donation
        .where({ donorId })
        .all();

      const donationIds = new Set(
        donations.map((donation) => donation.id),
      );

      receipts = receipts.filter((receipt) =>
        donationIds.has(receipt.donationId),
      );
    }

    if (year) {
      receipts = receipts.filter((receipt) => {
        const receiptYear = new Date(
          receipt.issuedDate,
        ).getFullYear();

        return receiptYear === year;
      });
    }

    if (date) {
      receipts = receipts.filter((receipt) => {
        const receiptDate = new Date(
          receipt.issuedDate,
        )
          .toISOString()
          .split('T')[0];

        return receiptDate === date;
      });
    }

    return receipts;
  }

  async getDashboard() {
  const issued = await db.orm.public.Receipt
    .where({ status: 'ISSUED' })
    .all();

  const voided = await db.orm.public.Receipt
    .where({ status: 'VOID' })
    .all();

  const allReceipts = await db.orm.public.Receipt.all();

  const replacements = allReceipts.filter(
    (receipt) => receipt.replacedReceiptId !== null,
  );

  return {
    issuedCount: issued.length,
    voidedCount: voided.length,
    replacementCount: replacements.length,
  };
}

}