import React, { useState } from 'react';
import { useVerification } from '../../context/VerificationContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';
import { 
  calculateFeeBreakdown 
} from '../../services/paymentService';
import type { CurrencyCode, VerificationRequest } from '../../types';
import { useNavigate } from 'react-router-dom';
import { PortalLayout } from '../layout/PortalLayout';
import { 
  CheckCircle2, 
  Check, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Printer, 
  Copy, 
  ArrowRight, 
  Lock
} from 'lucide-react';

export const ClientPaymentsView: React.FC = () => {
  const { clientRequests, currency, setCurrency, payInvoice, currentUser } = useVerification();
  const navigate = useNavigate();

  // Active view tab: 'invoices' | 'milestones'
  const [activeLedgerTab, setActiveLedgerTab] = useState<'invoices' | 'milestones'>('invoices');

  // Checkout modal state
  const [selectedPaymentReq, setSelectedPaymentReq] = useState<VerificationRequest | null>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushStep, setStkPushStep] = useState<'idle' | 'prompt_sent' | 'pin_entered' | 'confirmed'>('idle');

  // Card form state
  const [cardName, setCardName] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // Receipt modal state
  const [receiptModalReq, setReceiptModalReq] = useState<VerificationRequest | null>(null);

  // Itemized fee breakdown modal state
  const [breakdownModalReq, setBreakdownModalReq] = useState<VerificationRequest | null>(null);

  // Copy notification state
  const [copiedWireField, setCopiedWireField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculations
  const totalSettledKES = clientRequests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((sum, r) => sum + r.pricing.serviceFeeKES, 0);

  const pendingRequests = clientRequests.filter((r) => r.pricing.quoteStatus !== 'paid');
  const totalPendingKES = pendingRequests.reduce((sum, r) => sum + r.pricing.serviceFeeKES, 0);

  const stoppedRequests = clientRequests.filter((r) => hasStopPaymentWarning(r));
  const totalStoppedContractorKES = stoppedRequests.reduce((sum, r) => {
    return sum + (r.paymentDecisionRecord?.contractorRequestedKES || 0);
  }, 0);

  const handleOpenPay = (req: VerificationRequest) => {
    setSelectedPaymentReq(req);
    setPhoneNumber(currentUser?.phone || '+254 7');
    setStkPushStep('idle');
    setPayModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedPaymentReq) return;
    setIsProcessing(true);

    if (paymentMethod === 'mpesa') {
      setStkPushStep('prompt_sent');
      setTimeout(async () => {
        setStkPushStep('pin_entered');
        setTimeout(async () => {
          try {
            const res = await payInvoice(selectedPaymentReq.id, 'M-Pesa STK Push');
            if (res.success) {
              setToastMessage(`Payment of ${FORMAT_CURRENCY(selectedPaymentReq.pricing.serviceFeeKES, currency)} completed. Reference: ${res.txRef}`);
              setPayModalOpen(false);
              setStkPushStep('idle');
            }
          } catch (err: any) {
            setToastMessage(`Payment failed: ${err.message || 'Unknown error'}`);
          } finally {
            setIsProcessing(false);
          }
        }, 1200);
      }, 1400);
      return;
    }

    try {
      const res = await payInvoice(selectedPaymentReq.id, paymentMethod === 'card' ? 'Credit/Debit Card' : 'Wire Transfer');
      if (res.success) {
        setToastMessage(`Payment of ${FORMAT_CURRENCY(selectedPaymentReq.pricing.serviceFeeKES, currency)} completed. Reference: ${res.txRef}`);
        setPayModalOpen(false);
      }
    } catch (err: any) {
      setToastMessage(`Payment failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWireField(fieldKey);
    setTimeout(() => setCopiedWireField(null), 2500);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const currencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];

  return (
    <PortalLayout
      title="Payments & Escrow Ledger"
      subtitle="Transparent Verification Invoices & Protected Contractor Milestone Disbursements"
      role={currentUser?.role === 'admin' ? 'admin' : 'client'}
      activeTab="payments"
    >
      <div className="space-y-6">
        {/* Top Header with Multi-Currency Selector */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Independent Milestone Escrow & Dispute Buffer</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900 font-serif">
              Payments & Billing Ledger
            </h2>

            <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-500">
              Transparent settlement for field verification missions and stop-payment protection for your contractor disbursements in Kenya.
            </p>
          </div>

          {/* Currency Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 font-mono">Currency:</span>
            {currencies.map((curr) => {
              const isSelected = currency === curr;
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-[#0D5C3A] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>
        </div>

        {toastMessage && (
          <div className="bg-emerald-700 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-200 hover:text-white font-bold cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4-Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Verification Fees Settled</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {FORMAT_CURRENCY(totalSettledKES, currency)}
            </div>
            <p className="text-[11px] text-slate-400">
              {clientRequests.filter((r) => r.pricing.quoteStatus === 'paid').length} verified missions completed
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Pending Mission Quotes</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {FORMAT_CURRENCY(totalPendingKES, currency)}
            </div>
            <p className="text-[11px] text-amber-800 font-semibold">
              {pendingRequests.length} invoice awaiting settlement
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Contractor Funds Protected</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-rose-950">
              {FORMAT_CURRENCY(totalStoppedContractorKES, currency)}
            </div>
            <p className="text-[11px] text-rose-700 font-semibold">
              {stoppedRequests.length} Stop-Payment advisories active
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E2D8] p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Escrow Custody</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900 pt-1">
              KCB Upper Hill Trust Account
            </div>
            <p className="text-[11px] text-slate-400">
              Client funds buffered until on-ground evidence is authenticated
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E2D8] gap-4">
          <button
            type="button"
            onClick={() => setActiveLedgerTab('invoices')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeLedgerTab === 'invoices'
                ? 'border-[#0D5C3A] text-[#0D5C3A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Inspection Mission Invoices ({clientRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLedgerTab('milestones')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeLedgerTab === 'milestones'
                ? 'border-[#0D5C3A] text-[#0D5C3A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Contractor Milestone Escrow & Advisories ({stoppedRequests.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: INSPECTION MISSION INVOICES
        ========================================================================= */}
        {activeLedgerTab === 'invoices' && (
          <section className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Mission Description</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Amount ({currency})</th>
                      <th className="p-4">Escrow Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]/60">
                    {clientRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-500 text-xs">
                          No invoices or payment transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      clientRequests.map((req) => {
                        const isPaid = req.pricing.quoteStatus === 'paid';
                        const isStop = hasStopPaymentWarning(req);

                        return (
                          <tr key={req.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                            <td className="p-4 font-mono font-bold text-slate-900">
                              INV-{req.id.replace('DV-', '')}
                            </td>

                            <td className="p-4">
                              <div className="font-bold text-slate-900">{req.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {req.location.town}, {req.location.county} County
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="capitalize px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                {req.category}
                              </span>
                            </td>

                            <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                              {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
                            </td>

                            <td className="p-4">
                              <div className="flex flex-col gap-1 items-start">
                                {isPaid ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" /> Settled in Escrow
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" /> Unpaid Quote
                                  </span>
                                )}

                                {isStop && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    <AlertTriangle className="w-3 h-3 text-rose-600" /> Stop-Payment Alert
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-slate-500 font-mono text-[11px]">
                              {req.createdAt.substring(0, 10)}
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setBreakdownModalReq(req)}
                                  className="px-2.5 py-1 rounded-lg border border-[#E8E2D8] bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                                  title="View itemized cost breakdown"
                                >
                                  Breakdown
                                </button>

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
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            TAB 2: CONTRACTOR MILESTONE ESCROW & STOP-PAYMENT ADVISORIES
        ========================================================================= */}
        {activeLedgerTab === 'milestones' && (
          <section className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Contractor Milestone Disbursements Under Field Review
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Whenever an on-ground audit reveals unverified materials or structural discrepancies, our Nairobi desk triggers a stop-payment advisory to prevent unauthorized fund wire.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/construction')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Construction Oversight Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#E8E2D8]">
                {stoppedRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    All contractor claims currently match verified on-site milestones. No active stop-payment advisories.
                  </p>
                ) : (
                  stoppedRequests.map((req) => {
                    const pdr = req.paymentDecisionRecord;
                    return (
                      <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{req.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              Stop-Payment Advisory
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900">{req.title}</div>
                          <div className="text-[11px] text-slate-500">
                            Milestone Claim: <strong>{pdr?.milestoneTitle || 'Structural Audit'}</strong> · Target: {req.location.town}, {req.location.county}
                          </div>
                          {pdr?.coordinatorRecommendation && (
                            <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-1.5 max-w-2xl">
                              <strong>Coordinator Finding:</strong> {pdr.coordinatorRecommendation}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-slate-400">Claim Amount</div>
                            <div className="text-base font-bold font-mono text-slate-900">
                              {FORMAT_CURRENCY(pdr?.contractorRequestedKES || 0, currency)}
                            </div>
                            {pdr?.unexplainedVarianceKES ? (
                              <div className="text-[10px] font-bold text-rose-600 font-mono">
                                Variance: {FORMAT_CURRENCY(pdr.unexplainedVarianceKES, currency)}
                              </div>
                            ) : null}
                          </div>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/construction')}
                          >
                            Inspect Audit →
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            MODAL 1: MULTI-RAIL CHECKOUT (M-PESA, CARD, WIRE)
        ========================================================================= */}
        {selectedPaymentReq && (
          <Modal
            isOpen={payModalOpen}
            onClose={() => {
              setPayModalOpen(false);
              setStkPushStep('idle');
            }}
            title={`Settle Invoice: INV-${selectedPaymentReq.id.replace('DV-', '')}`}
            description={`Independent field verification fee for ${selectedPaymentReq.title}`}
          >
            <div className="space-y-5 text-left text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-1">
                <div className="text-slate-500 font-medium">Invoice Total ({currency}):</div>
                <div className="text-2xl font-bold font-mono text-[#171310]">
                  {FORMAT_CURRENCY(selectedPaymentReq.pricing.serviceFeeKES, currency)}
                </div>
                <div className="text-[11px] text-slate-500">
                  Includes vetted verifier logistics, GPS telemetrics, and verified QA dossier generation.
                </div>
              </div>

              {/* Payment Rail Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800">Select Settlement Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('mpesa');
                      setStkPushStep('idle');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-[#E8E2D8] bg-white hover:border-emerald-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <div className="font-bold text-[11px]">M-Pesa STK</div>
                    <div className="text-[10px] text-slate-500">Instant Safaricom PIN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-[#E8E2D8] bg-white hover:border-emerald-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <div className="font-bold text-[11px]">Card (Debit/Credit)</div>
                    <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-[#E8E2D8] bg-white hover:border-emerald-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                    <div className="font-bold text-[11px]">Trust Wire</div>
                    <div className="text-[10px] text-slate-500">KCB Upper Hill</div>
                  </button>
                </div>
              </div>

              {/* M-PESA CHANNEL DETAILS */}
              {paymentMethod === 'mpesa' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Safaricom Mobile Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <p className="text-[10px] text-slate-500">
                      An STK PIN prompt will be dispatched directly to your mobile phone.
                    </p>
                  </div>

                  {stkPushStep === 'prompt_sent' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2 animate-pulse">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>STK prompt dispatched to {phoneNumber}. Please input your Safaricom PIN...</span>
                    </div>
                  )}

                  {stkPushStep === 'pin_entered' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>PIN confirmed. Communicating with Safaricom M-Pesa gateway...</span>
                    </div>
                  )}
                </div>
              )}

              {/* CARD CHANNEL DETAILS */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="font-bold text-slate-800 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>256-Bit SSL Encrypted · 3D Secure Verification</span>
                  </div>
                </div>
              )}

              {/* BANK WIRE CHANNEL DETAILS */}
              {paymentMethod === 'bank' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px]">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>DiasporaVerify Trust Account Details:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                      Upper Hill Nairobi
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Bank:</span>
                      <span className="font-bold text-slate-800">KCB Bank Kenya Ltd</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Account Name:</span>
                      <span className="font-bold text-slate-800">DiasporaVerify Trust Operations Ltd</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-900">1289 4402 1198</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText('128944021198', 'acc')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                          title="Copy account number"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Swift / BIC:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">KCBLKENX</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText('KCBLKENX', 'swift')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Payment Reference:</span>
                      <span className="font-bold text-[#0D5C3A]">{`INV-${selectedPaymentReq.id.replace('DV-', '')}`}</span>
                    </div>
                  </div>

                  {copiedWireField && (
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Copied {copiedWireField.toUpperCase()} to clipboard.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8E2D8]">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPayModalOpen(false);
                    setStkPushStep('idle');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleProcessPayment}
                  isLoading={isProcessing}
                >
                  {paymentMethod === 'mpesa' ? 'Send STK Push' : paymentMethod === 'bank' ? 'Confirm Wire Dispatched' : 'Authorize Card Payment'}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* =========================================================================
            MODAL 2: ITEMIZED FEE TRANSPARENCY BREAKDOWN
        ========================================================================= */}
        {breakdownModalReq && (() => {
          const breakdown = calculateFeeBreakdown(
            breakdownModalReq.category,
            breakdownModalReq.urgency || 'standard',
            breakdownModalReq.location.county,
            currency
          );

          return (
            <Modal
              isOpen={!!breakdownModalReq}
              onClose={() => setBreakdownModalReq(null)}
              title={`Transparent Fee Schedule: INV-${breakdownModalReq.id.replace('DV-', '')}`}
              description={`Cost breakdown for ${breakdownModalReq.title}`}
            >
              <div className="space-y-4 text-left text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Location & Category</span>
                    <span className="font-bold text-slate-900">{breakdownModalReq.location.county} County · {breakdownModalReq.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total Due</span>
                    <span className="text-xl font-bold font-mono text-[#0D5C3A]">
                      {FORMAT_CURRENCY(breakdown.totalKES, currency)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 divide-y divide-[#E8E2D8]/80 text-slate-700 text-xs">
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-900 block">1. Base Verification Task Fee</span>
                      <span className="text-[11px] text-slate-500">Fixed rate for {breakdownModalReq.category} physical site audit</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(breakdown.serviceBaseFeeKES, currency)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-900 block">2. County Travel Logistics</span>
                      <span className="text-[11px] text-slate-500">Transit to {breakdownModalReq.location.county} and return</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(breakdown.countyTravelFeeKES, currency)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-900 block">3. Field Telemetrics & Calibrated Equipment</span>
                      <span className="text-[11px] text-slate-500">GPS geofencing, battery reserves, offline field data sync</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(breakdown.fieldOperationsFeeKES, currency)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-bold text-slate-900 block">4. Cryptographic Storage & QA Review</span>
                      <span className="text-[11px] text-slate-500">SHA-256 evidence hashing, senior review, immutable archiving</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(breakdown.platformFeeKES, currency)}</span>
                  </div>

                  {breakdown.urgencyFeeKES > 0 && (
                    <div className="flex items-center justify-between pt-2 text-amber-800">
                      <div>
                        <span className="font-bold block">5. Urgency Expedited Surcharge</span>
                        <span className="text-[11px] text-amber-700">Priority scheduling tariff</span>
                      </div>
                      <span className="font-mono font-bold">{FORMAT_CURRENCY(breakdown.urgencyFeeKES, currency)}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-[11px] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-slate-300">
                    No hidden charges. Our fee covers full on-ground execution. All contractor disbursements remain separate and buffered in your KCB Trust escrow.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" onClick={() => setBreakdownModalReq(null)}>
                    Close Breakdown
                  </Button>
                </div>
              </div>
            </Modal>
          );
        })()}

        {/* =========================================================================
            MODAL 3: OFFICIAL PRINTABLE TAX RECEIPT
        ========================================================================= */}
        {receiptModalReq && (
          <Modal
            isOpen={!!receiptModalReq}
            onClose={() => setReceiptModalReq(null)}
            title={`Official Payment Receipt: REC-${receiptModalReq.id.replace('DV-', '')}`}
          >
            <div className="space-y-5 text-left text-xs">
              {/* Receipt Header Card */}
              <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-emerald-300 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 tracking-wider block">
                      DiasporaVerify Ltd · Nairobi Operations Desk
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                      Settlement Receipt
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SETTLED
                  </span>
                </div>

                <div className="text-3xl font-bold font-mono text-[#0D5C3A] pt-1">
                  {FORMAT_CURRENCY(receiptModalReq.pricing.serviceFeeKES, currency)}
                </div>

                <p className="text-[11px] text-slate-500">
                  Trust Custody: KCB Bank Kenya Ltd (Upper Hill Branch, Nairobi)
                </p>
              </div>

              {/* Receipt Line Details */}
              <div className="space-y-2 border-t border-[#E8E2D8] pt-3 text-slate-600 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mission Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">{receiptModalReq.id}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Billed Account:</span>
                  <span className="font-bold text-slate-900">{receiptModalReq.client.name}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Target Location:</span>
                  <span className="text-slate-900">{receiptModalReq.location.town}, {receiptModalReq.location.county} County</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Reference:</span>
                  <span className="font-mono font-bold text-emerald-900">
                    MPESA-{(receiptModalReq.id || 'DV').replace(/[^0-9]/g, '') || '948271'}TX
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Issued Timestamp:</span>
                  <span className="font-mono text-slate-900">{receiptModalReq.createdAt}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Evidence SHA-256 Stamp:</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF Receipt</span>
                </button>

                <Button variant="primary" onClick={() => setReceiptModalReq(null)}>
                  Close Receipt
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PortalLayout>
  );
};
