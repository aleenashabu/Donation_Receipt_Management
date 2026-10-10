import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsNumberString,
  Matches,
} from 'class-validator';

enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER',
}


enum DonationStatus {
  RECEIVED = 'RECEIVED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}


export class CreateDonationDto {

@IsInt()
@IsNotEmpty()
donorId!: number;

@IsInt()
@IsNotEmpty()
fundId!: number;

@IsDateString()
@IsNotEmpty()
donationDate!: string;

@IsNumberString()
@IsNotEmpty()
@Matches(/^(?!0+(?:\.0+)?$)\d+(?:\.\d+)?$/, {
  message: 'Amount must be greater than 0',
})
amount!: string;

@IsEnum(PaymentMethod)
paymentMethod!: PaymentMethod;

@IsEnum(DonationStatus)
@IsNotEmpty()
status!: DonationStatus;

@IsString()
@IsNotEmpty()
referenceNumber!: string;

@IsString()
@IsNotEmpty()
purpose!: string;

@IsString()
@IsNotEmpty()
notes!: string;

}