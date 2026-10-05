export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'paystack_card' | 'paystack_mpesa' | 'bank_transfer' | 'pending';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceKES: number;
  totalKES: number;
}

export interface Invoice {
  id: string;
  requestId: string;
  invoiceNumber: string; // e.g. "DV-INV-2026-0001"
  clientName: string;
  clientEmail: string;
  items: InvoiceLineItem[];
  subtotalKES: number;
  taxKES: number; // 16% VAT
  totalKES: number;
  currency: string;
  convertedTotal: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string; // Paystack transaction ref
  paystackVerified: boolean; // true only after server-side verification
  issuedAt: string;
  paidAt?: string;
  dueDate: string;
  notes?: string;
}
