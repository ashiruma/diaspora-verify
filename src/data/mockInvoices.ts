import { Invoice } from '../types/invoice';
import { MOCK_REQUESTS } from './mockRequests'; // Assuming this exists

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    requestId: MOCK_REQUESTS[0].id,
    invoiceNumber: 'DV-INV-2026-0001',
    clientName: MOCK_REQUESTS[0].clientName,
    clientEmail: MOCK_REQUESTS[0].clientEmail,
    items: [
      { description: 'Baseline site visit', quantity: 1, unitPriceKES: 12000, totalKES: 12000 },
      { description: 'Milestone check', quantity: 2, unitPriceKES: 8000, totalKES: 16000 },
      { description: 'Travel allowance', quantity: 1, unitPriceKES: 3000, totalKES: 3000 },
    ],
    subtotalKES: 31000,
    taxKES: Math.round(0.16 * 31000),
    totalKES: 31000 + Math.round(0.16 * 31000),
    currency: 'USD',
    convertedTotal: parseFloat(
      // Using a placeholder conversion; actual conversion performed at runtime
      (31000 * 0.0091).toFixed(2)
    ),
    status: 'draft',
    paymentMethod: 'paystack_card',
    paystackVerified: false,
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-002',
    requestId: MOCK_REQUESTS[1].id,
    invoiceNumber: 'DV-INV-2026-0002',
    clientName: MOCK_REQUESTS[1].clientName,
    clientEmail: MOCK_REQUESTS[1].clientEmail,
    items: [
      { description: 'Property verification', quantity: 1, unitPriceKES: 20000, totalKES: 20000 },
      { description: 'Travel allowance', quantity: 1, unitPriceKES: 4000, totalKES: 4000 },
    ],
    subtotalKES: 24000,
    taxKES: Math.round(0.16 * 24000),
    totalKES: 24000 + Math.round(0.16 * 24000),
    currency: 'EUR',
    convertedTotal: parseFloat((24000 * 0.0075).toFixed(2)),
    status: 'sent',
    paymentMethod: 'paystack_card',
    paystackVerified: false,
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-003',
    requestId: MOCK_REQUESTS[2].id,
    invoiceNumber: 'DV-INV-2026-0003',
    clientName: MOCK_REQUESTS[2].clientName,
    clientEmail: MOCK_REQUESTS[2].clientEmail,
    items: [
      { description: 'Family welfare visit', quantity: 1, unitPriceKES: 15000, totalKES: 15000 },
    ],
    subtotalKES: 15000,
    taxKES: Math.round(0.16 * 15000),
    totalKES: 15000 + Math.round(0.16 * 15000),
    currency: 'GBP',
    convertedTotal: parseFloat((15000 * 0.0065).toFixed(2)),
    status: 'draft',
    paymentMethod: 'paystack_card',
    paystackVerified: false,
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
