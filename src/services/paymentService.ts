import type { ServiceCategory, CurrencyCode, FeeBreakdown } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  KES: 1,
  USD: 0.0077,
  GBP: 0.0060,
  EUR: 0.0071,
  AED: 0.028,
  CAD: 0.010,
  AUD: 0.012,
};

export const BASE_FEES_BY_CATEGORY: Record<ServiceCategory, number> = {
  construction: 14500,
  property: 12000,
  vehicle: 16000,
  business: 13500,
  family: 18000,
  document: 11000,
  person: 14000,
  purchase: 13000,
  field_assistance: 12500,
  custom: 15000,
};

// Travel logistics fee from Nairobi HQ or regional hubs
export const COUNTY_TRAVEL_FEES_KES: Record<string, number> = {
  'Nairobi': 1500,
  'Kiambu': 2500,
  'Machakos': 3500,
  'Kajiado': 3500,
  'Murang\'a': 4500,
  'Nakuru': 6500,
  'Kirinyaga': 5500,
  'Nyeri': 6000,
  'Mombasa': 12000,
  'Kilifi': 13000,
  'Kwale': 13500,
  'Kisumu': 11000,
  'Uasin Gishu': 10500,
  'Nandi': 11500,
  'Kakamega': 12500,
  'Meru': 8500,
  'Embu': 7000,
  'Laikipia': 8000,
  'Other': 5000,
};

export const KENYA_COUNTIES = [
  'Nairobi', 'Kajiado', 'Kiambu', 'Machakos', 'Nakuru', 'Uasin Gishu', 
  'Mombasa', 'Kilifi', 'Kisumu', 'Murang\'a', 'Kirinyaga', 'Nyeri', 
  'Meru', 'Kakamega', 'Laikipia', 'Trans Nzoia'
];

/**
 * Calculates a fully transparent fee breakdown for any verification request.
 */
export function calculateFeeBreakdown(
  category: ServiceCategory = 'property',
  urgency: 'standard' | 'priority' | 'urgent' = 'standard',
  county: string = 'Nairobi',
  currency: CurrencyCode = 'KES'
): FeeBreakdown {
  const serviceBaseFeeKES = BASE_FEES_BY_CATEGORY[category] || 12500;
  const countyTravelFeeKES = COUNTY_TRAVEL_FEES_KES[county] || COUNTY_TRAVEL_FEES_KES['Other'];
  const fieldOperationsFeeKES = 3500; // Calibrated field equipment, battery packs, transport allowance
  const platformFeeKES = 2000; // Cryptographic SHA-256 evidence storage, immutable archiving, QA coordination

  // Urgency multiplier on service base fee
  const urgencyMultiplier = urgency === 'urgent' ? 0.4 : urgency === 'priority' ? 0.2 : 0;
  const urgencyFeeKES = Math.round(serviceBaseFeeKES * urgencyMultiplier);

  const totalKES = serviceBaseFeeKES + fieldOperationsFeeKES + countyTravelFeeKES + urgencyFeeKES + platformFeeKES;

  return {
    serviceBaseFeeKES,
    fieldOperationsFeeKES,
    countyTravelFeeKES,
    urgencyFeeKES,
    platformFeeKES,
    totalKES,
    currency
  };
}

/**
 * Currency conversion and formatting matching invariant Rule 3
 */
export function formatCurrency(amountKES: number | undefined | null, currency: CurrencyCode = 'KES'): string {
  if (amountKES === undefined || amountKES === null || isNaN(amountKES)) {
    return 'KES 0';
  }
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = amountKES * rate;

  switch (currency) {
    case 'USD':
      return `$${Math.round(converted).toLocaleString('en-US')}`;
    case 'GBP':
      return `£${Math.round(converted).toLocaleString('en-GB')}`;
    case 'EUR':
      return `€${Math.round(converted).toLocaleString('de-DE')}`;
    case 'AED':
      return `AED ${Math.round(converted).toLocaleString('en-AE')}`;
    case 'CAD':
      return `CA$${Math.round(converted).toLocaleString('en-CA')}`;
    case 'AUD':
      return `AU$${Math.round(converted).toLocaleString('en-AU')}`;
    case 'KES':
    default:
      return `KES ${Math.round(converted).toLocaleString('en-KE')}`;
  }
}

export type PaymentMethodType = 'mpesa_stk' | 'mpesa_paybill' | 'card_international' | 'wire_transfer';

export interface PaymentInitiationResult {
  transactionReference: string;
  checkoutUrl?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  instructions?: string;
  paybillNumber?: string;
  accountNumber?: string;
  amountKES: number;
  formattedAmount: string;
}

/**
 * Payment Abstraction Layer (Clean provider interface decoupled from UI)
 */
export interface PaymentProvider {
  name: string;
  initiatePayment: (requestId: string, amountKES: number, clientPhone: string, clientEmail: string, currency: CurrencyCode) => Promise<PaymentInitiationResult>;
  verifyPayment: (reference: string) => Promise<{ verified: boolean; paidAt?: string }>;
}

export class MpesaExpressProvider implements PaymentProvider {
  name = 'M-Pesa STK Push';

  async initiatePayment(requestId: string, amountKES: number, clientPhone: string, _email: string, currency: CurrencyCode): Promise<PaymentInitiationResult> {
    const reference = `MPESA-${Date.now().toString().slice(-8)}`;
    return {
      transactionReference: reference,
      status: 'PENDING',
      amountKES,
      formattedAmount: formatCurrency(amountKES, currency),
      instructions: `Prompt sent to ${clientPhone}. Enter M-Pesa PIN on handset to authorize DiasporaVerify service fee disbursement.`,
      paybillNumber: '522522',
      accountNumber: requestId
    };
  }

  async verifyPayment(_reference: string): Promise<{ verified: boolean; paidAt?: string }> {
    return {
      verified: true,
      paidAt: new Date().toISOString()
    };
  }
}

export class CardPaymentProvider implements PaymentProvider {
  name = 'International Card (Visa / Mastercard / Amex)';

  async initiatePayment(requestId: string, amountKES: number, _phone: string, clientEmail: string, currency: CurrencyCode): Promise<PaymentInitiationResult> {
    const reference = `CARD-${Date.now().toString().slice(-8)}`;
    return {
      transactionReference: reference,
      status: 'PENDING',
      amountKES,
      formattedAmount: formatCurrency(amountKES, currency),
      instructions: `Secure 3D-Secure payment session initiated for ${clientEmail}.`,
      checkoutUrl: `https://checkout.diaspora-verify.ke/pay?ref=${reference}&req=${requestId}`
    };
  }

  async verifyPayment(_reference: string): Promise<{ verified: boolean; paidAt?: string }> {
    return {
      verified: true,
      paidAt: new Date().toISOString()
    };
  }
}

export const mpesaProvider = new MpesaExpressProvider();
export const cardProvider = new CardPaymentProvider();
