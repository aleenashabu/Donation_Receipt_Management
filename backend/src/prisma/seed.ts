import { db } from './db.js';

async function seed() {
  const donor = await db.orm.public.Donor.create({
    firstName: 'Elly',
    lastName: 'John',
    email: 'elly.john@example.com',
    phone: '416-555-0134',
    address: '24 Garden Avenue',
    city: 'Toronto',
    province: 'Ontario',
    postalCode: 'M5V 2T6',
    country: 'Canada',
  });

  const fund = await db.orm.public.Fund.create({
    name: 'Community Programs',
    description: 'Flexible support for community programs.',
  });

  await db.orm.public.Donation.create({
    referenceNumber: 'TEST-001',
    donationDate: '2026-09-15T16:00:00.000Z',
    amount: '125.00',
    paymentMethod: 'CREDIT_CARD',
    purpose: 'Community programs',
    notes: 'Seed donation for community programs.',
    status: 'RECEIVED',
    donorId: donor.id,
    fundId: fund.id,
  });

  await db.orm.public.Donation.create({
    referenceNumber: 'TEST-002',
    donationDate: '2026-09-28T16:00:00.000Z',
    amount: '50.00',
    paymentMethod: 'BANK_TRANSFER',
    purpose: 'Community programs',
    notes: 'Seed donation for community programs.',
    status: 'PENDING',
    donorId: donor.id,
    fundId: fund.id,
  });
}

seed();