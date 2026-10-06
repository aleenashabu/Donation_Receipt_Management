import { IsEnum, IsOptional } from 'class-validator';

enum DonationStatus {
  RECEIVED = 'RECEIVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class UpdateDonationDto {
  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;
}
