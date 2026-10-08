import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { 
  Check, 
  Clock, 
  AlertTriangle
} from '../Icons';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const ClientPaymentsView: React.FC = () => {
  const { clientRequests, currency, payInvoice } = useVerification();
  const navigate = useNavigate();

  const [selectedPaymentReq, setSelectedPaymentReq] = useState<any>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('+254 712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptModalReq, setReceiptModalReq] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculations
  const totalSettledKES = clientRequests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((sum, r) => sum + r.pricing.serviceFeeKES, 0);

  const pendingRequests = clientRequests.filter((r) => r.pricing.quoteStatus !== 'paid');
  const totalPendingKES = pendingRequests.reduce((sum, r) => sum + r.pricing.serviceFeeKES, 0);

  const stoppedRequests = clientRequests.filter((r) => hasStopPaymentWarning(r));

  const handleOpenPay = (req: any) => {
    setSelectedPaymentReq(req);
    setPhoneNumber(req.client?.phone || '+254 712 345 678');
    setPayModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPaymentReq) return;
    setIsProcessing(true);
    try {
      const res = await payInvoice(selectedPaymentReq.id, paymentMethod);
      if (res.success) {
        setToastMessage(`Payment of ${FORMAT_CURRENCY(selectedPaymentReq.pricing.serviceFeeKES, currency)} completed! Tx Ref: ${res.txRef}`);
        setPayModalOpen(false);
      }
    } catch (err: any) {
      setToastMessage(`Payment failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans text-left">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
          Payments & Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Direct settlement for independent inspection fees and milestone disbursements with M-Pesa, card, or international wire.
        </p>
      </div>

      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Settled</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {FORMAT_CURRENCY(totalSettledKES, currency)}
          </div>
          <p className="text-[11px] text-slate-400">
            {clientRequests.filter((r) => r.pricing.quoteStatus === 'paid').length} settled missions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {FORMAT_CURRENCY(totalPendingKES, currency)}
          </div>
          <p className="text-[11px] text-slate-400">
            {pendingRequests.length} pending action
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Protected By Stop-Payment</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {stoppedRequests.length} Advisories
          </div>
          <p className="text-[11px] text-rose-600 font-semibold">
            Funds withheld pending audit resolution
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Inspection Invoices & Receipts</h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Mission Description</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientRequests.map((req) => {
                  const isPaid = req.pricing.quoteStatus === 'paid';
                  const isStop = hasStopPaymentWarning(req);

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-700">
                        INV-{req.id.replace('DV-', '')}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{req.title}</div>
                        <div className="text-[11px] text-slate-500">{req.location.town}, {req.location.county}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
                      </td>
                      <td className="p-3.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Settled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" /> Unpaid
                          </span>
                        )}
                        {isStop && (
                          <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Stop Advisory
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {req.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {isPaid ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReceiptModalReq(req)}
                          >
                            View Receipt
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenPay(req)}
                          >
                            Pay Now
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/request/${req.id}`)}
                        >
                          Details →
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pay Invoice Modal */}
      {selectedPaymentReq && (
        <Modal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title={`Settle Invoice: INV-${selectedPaymentReq.id.replace('DV-', '')}`}
          description={`Payment for ${selectedPaymentReq.title}`}
        >
          <div className="space-y-5 text-left text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500">Total Due:</div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {FORMAT_CURRENCY(selectedPaymentReq.pricing.serviceFeeKES, currency)}
              </div>
              <div className="text-[11px] text-slate-400">
                Includes independent verifier travel, GPS telemetrics, and verified report generation.
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800">Select Payment Rail</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'mpesa' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'
                  }`}
                >
                  <div className="font-bold">M-Pesa Express</div>
                  <div className="text-[10px] text-slate-500">STK Push prompt</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'
                  }`}
                >
                  <div className="font-bold">Credit/Debit Card</div>
                  <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'bank' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold' : 'border-slate-200'
                  }`}
                >
                  <div className="font-bold">Wire Transfer</div>
                  <div className="text-[10px] text-slate-500">KCB / Equity Bank</div>
                </button>
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">M-Pesa Phone Number (Safaricom)</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
                <p className="text-[10px] text-slate-400">An instant PIN prompt will appear on your Safaricom handset.</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setPayModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleProcessPayment}
                isLoading={isProcessing}
              >
                Confirm & Authorize Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Receipt Modal */}
      {receiptModalReq && (
        <Modal
          isOpen={!!receiptModalReq}
          onClose={() => setReceiptModalReq(null)}
          title={`Payment Receipt: REC-${receiptModalReq.id.replace('DV-', '')}`}
        >
          <div className="space-y-4 text-left text-xs">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 text-sm">Payment Verified</span>
                <span className="font-mono text-emerald-700 font-bold">SETTLED</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-950">
                {FORMAT_CURRENCY(receiptModalReq.pricing.serviceFeeKES, currency)}
              </div>
              <p className="text-[11px] text-emerald-800">
                DiasporaVerify Trust Account (KCB Towers Upper Hill, Nairobi)
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-600">
              <div className="flex justify-between">
                <span>Mission Identifier:</span>
                <span className="font-mono font-bold text-slate-900">{receiptModalReq.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Billed To:</span>
                <span className="font-bold text-slate-900">{receiptModalReq.client.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span>{receiptModalReq.location.town}, {receiptModalReq.location.county}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-800">MPESA-{(receiptModalReq.id || 'DV').replace(/[^0-9]/g, '') || '948271'}TX</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{receiptModalReq.createdAt}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setReceiptModalReq(null)}>
                Close Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
