import { IsInt } from 'class-validator';

export class CreateReceiptDto {
  @IsInt()
  donationId: number;

  @IsInt()
  createdById: number;
}