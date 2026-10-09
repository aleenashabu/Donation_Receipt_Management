
import { Injectable } from '@nestjs/common';
import { db } from '../prisma/db.js';

@Injectable()
export class DashboardService {
  async getDashboard() {
    const donations = await db.orm.public.Donation
      .where({ status: 'RECEIVED' })
      .all();

    const totalDonations = donations.reduce(
      (total, donation) => total + Number(donation.amount),
      0,
    );

    const allDonations = await db.orm.public.Donation.all();
    const donationCount = allDonations.length;

    const now = new Date();

    const currentMonthDonations = donations.filter((donation) => {
      const donationDate = new Date(donation.donationDate);

      return (
        donationDate.getFullYear() === now.getFullYear() &&
        donationDate.getMonth() === now.getMonth()
      );
    });

    const currentMonthTotal = currentMonthDonations.reduce(
      (total, donation) => total + Number(donation.amount),
      0,
    );

    return {
      totalDonations: totalDonations.toFixed(2),
      donationCount,
      currentMonthTotal: currentMonthTotal.toFixed(2),
    };
  }

  async getMonthlySummary() {
    const donations = await db.orm.public.Donation
      .where({ status: 'RECEIVED' })
      .all();

    const monthlySummary: Record<
      string,
      {
        donationCount: number;
        totalAmount: number;
      }
    > = {};

    donations.forEach((donation) => {
      const date = new Date(donation.donationDate);

      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;

      if (!monthlySummary[month]) {
        monthlySummary[month] = {
          donationCount: 0,
          totalAmount: 0,
        };
      }

      monthlySummary[month].donationCount += 1;
      monthlySummary[month].totalAmount += Number(donation.amount);
    });

    return Object.entries(monthlySummary).map(
      ([month, summary]) => ({
        month,
        donationCount: summary.donationCount,
        totalAmount: summary.totalAmount.toFixed(2),
      }),
    );
  }
}
