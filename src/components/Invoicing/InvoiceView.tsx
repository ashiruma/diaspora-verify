import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from '../Icons';
import { FORMAT_CURRENCY } from '../../data/mockData';
import { Invoice } from '../../types/invoice';

export const InvoiceView: React.FC<{ invoice: Invoice; currency: string; onPaymentComplete: (invoiceId: string, ref: string) => void }> = ({ invoice, currency, onPaymentComplete }) => {
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState(invoice.status);

  const handlePay = async () => {
    setPaying(true);
    // simulate async Paystack verification delay
    setTimeout(() => {
      const mockRef = `ps_${Math.random().toString(36).substring(2, 10)}`;
      setStatus('paid');
      onPaymentComplete(invoice.id, mockRef);
      setPaying(false);
    }, 2000);
  };

  const statusBadge = {
    draft: 'bg-gray-200 text-gray-800',
    sent: 'bg-blue-200 text-blue-800',
    paid: 'bg-emerald-200 text-emerald-800',
    overdue: 'bg-red-200 text-red-800',
    cancelled: 'bg-slate-200 text-slate-800',
  }[status];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Invoice {invoice.invoiceNumber}</h2>
        <span className={`px-2 py-0.5 rounded text-sm ${statusBadge}`}>{status.toUpperCase()}</span>
      </div>
      <div className="text-sm text-slate-600 mb-4">
        <p><strong>Issued:</strong> {invoice.issuedAt}</p>
        <p><strong>Due:</strong> {invoice.dueDate}</p>
        <p><strong>Client:</strong> {invoice.clientName} ({invoice.clientEmail})</p>
      </div>
      <table className="w-full table-auto border-collapse mb-4">
        <thead>
          <tr className="bg-slate-50">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-right">Qty</th>
            <th className="border p-2 text-right">Unit Price (KES)</th>
            <th className="border p-2 text-right">Total (KES)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} className="odd:bg-slate-50">
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-right">{item.quantity}</td>
              <td className="border p-2 text-right">{item.unitPriceKES.toLocaleString()}</td>
              <td className="border p-2 text-right">{item.totalKES.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border p-2 text-right font-semibold">Subtotal</td>
            <td className="border p-2 text-right">{invoice.subtotalKES.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={3} className="border p-2 text-right font-semibold">VAT (16%)</td>
            <td className="border p-2 text-right">{invoice.taxKES.toLocaleString()}</td>
          </tr>
          <tr className="bg-slate-100">
            <td colSpan={3} className="border p-2 text-right font-bold">Total (KES)</td>
            <td className="border p-2 text-right font-bold">{invoice.totalKES.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={3} className="border p-2 text-right font-semibold">Total ({currency})</td>
            <td className="border p-2 text-right">{FORMAT_CURRENCY(invoice.convertedTotal, currency as any)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="text-xs text-slate-500 mb-4">
        This invoice covers DiasporaVerify service fees only. Client funds for purchases, construction payments, or other disbursements are handled separately.
      </p>
      {status !== 'paid' && (
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePay}
            disabled={paying}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 flex items-center"
          >
            {paying ? 'Processing…' : 'Pay Now'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
          <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};
