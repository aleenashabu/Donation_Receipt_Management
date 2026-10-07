import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

enum DonationStatus {
  RECEIVED = 'RECEIVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER',
}

export class UpdateDonationDto {
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  donorId?: number;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  fundId?: number;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  donationDate?: string;

  @IsOptional()
  @IsNumberString()
  @Matches(/^(?!0+(?:\.0+)?$)\d+(?:\.\d+)?$/, {
    message: 'Amount must be greater than 0',
  })
  amount?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  purpose?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @IsOptional()
  @IsEnum(DonationStatus)
  status?: DonationStatus;
}