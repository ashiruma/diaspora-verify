import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { 
  AlertTriangle, 
  FileText, 
  Check, 
  Award,
  UserCheck,
  Calendar,
  ShieldCheck,
  X,
  MapPin,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Users,
  DollarSign,
  Globe,
  Phone,
  Mail,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Building,
  ChevronDown
} from '../Icons';
import { StatusBadge, ProcessStageBadge, CategoryIcon } from '../CommonBadges';
import type { VerificationStatus, CurrencyCode } from '../../types';
import { FORMAT_CURRENCY, hasStopPaymentWarning } from '../../data/mockData';
import { calculateConfidenceScore } from '../../services/confidenceScorer';
import { ROLE_PERMISSIONS } from '../../auth/authorization';
import { CockpitContent } from './OperationsCockpit';

export type OperationsTab = 
  | 'operations' 
  | 'requests' 
  | 'assignments' 
  | 'agents' 
  | 'clients' 
  | 'contacts'
  | 'reports' 
  | 'payments' 
  | 'disputes' 
  | 'analytics' 
  | 'services' 
  | 'settings';

export const OperationsDashboard: React.FC<{ onOpenReport: (req: any) => void }> = ({ onOpenReport }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { 
    requests, 
    agents, 
    submitQAReview, 
    assignAgent, 
    currency, 
    disputes, 
    resolveDispute, 
    auditLogs, 
    advanceRequestStatus, 
    startViewAs, 
    seedSampleData, 
    resetAllData 
  } = useVerification();

  const [selectedReqId, setSelectedReqId] = useState<string>(requests[0]?.id || '');
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const tabParam = searchParams.get('tab');
  const getTabFromParam = (param: string | null): OperationsTab => {
    if (param === 'requests' || param === 'triage') return 'requests';
    if (param === 'assignments') return 'assignments';
    if (param === 'agents') return 'agents';
    if (param === 'clients') return 'clients';
    if (param === 'contacts' || param === 'directory') return 'contacts';
    if (param === 'reports' || param === 'qa') return 'reports';
    if (param === 'payments') return 'payments';
    if (param === 'disputes') return 'disputes';
    if (param === 'analytics' || param === 'map') return 'analytics';
    if (param === 'services') return 'services';
    if (param === 'settings' || param === 'audit') return 'settings';
    return 'operations';
  };

  const [activeTab, setActiveTab] = useState<OperationsTab>(() => getTabFromParam(tabParam));
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    setActiveTab(getTabFromParam(tabParam));
  }

  const handleTabChange = (tab: OperationsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // QA Review form state for selected request
  const activeReq = requests.find(r => r.id === selectedReqId) || requests[0];

  const [qaStatus, setQaStatus] = useState<VerificationStatus>(activeReq?.status || 'observed');
  const [qaFindings, setQaFindings] = useState(activeReq?.qaReview?.findingsSummary || '');
  const [qaRecommendation, setQaRecommendation] = useState(activeReq?.qaReview?.recommendation || '');
  const [qaRecommendationType, setQaRecommendationType] = useState<'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNABLE_TO_VERIFY' | 'REQUIRES_FURTHER_INVESTIGATION'>(
    activeReq?.qaReview?.recommendationType || 'VERIFIED'
  );
  const [stopPaymentAlert, setStopPaymentAlert] = useState(activeReq?.paymentDecisionRecord?.stopPaymentAlert || false);
  const [contradictionInput, setContradictionInput] = useState('');
  const [contradictionsList, setContradictionsList] = useState<string[]>(activeReq?.qaReview?.contradictions || []);
  const [uncertaintyInput, setUncertaintyInput] = useState('');
  const [uncertaintiesList, setUncertaintiesList] = useState<string[]>(activeReq?.qaReview?.whatCouldNotBeVerified || []);

  // Additional Information Request State
  const [showAdditionalInfoForm, setShowAdditionalInfoForm] = useState(false);
  const [additionalInfoNotes, setAdditionalInfoNotes] = useState('');

  // Agent Assignment Modal State
  const [assigningReqId, setAssigningReqId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-14');
  const [conflictNotes, setConflictNotes] = useState<string>('Agent signed conflict-of-interest disclosure; verified zero financial, family, or clan relation to contractor or landowner.');
  const [conflictConfirmed, setConflictConfirmed] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map County Filter
  const [selectedCountyFilter, setSelectedCountyFilter] = useState<string>('all');

  // Dispute Resolution State
  const [resolvingDisputeId, setResolvingDisputeId] = useState<string | null>(null);
  const [adminDisputeNotes, setAdminDisputeNotes] = useState('');
  const [disputeResolutionAction, setDisputeResolutionAction] = useState('Re-inspection completed with verified evidence');

  // Triage Search & Cockpit View Mode
  const [opsViewMode, setOpsViewMode] = useState<'cockpit' | 'queue'>('cockpit');
  const [triageSearch, setTriageSearch] = useState('');
  const [triageCategoryFilter, setTriageCategoryFilter] = useState('all');

  // Money in / out ledger filters
  const [moneyLedgerFilter, setMoneyLedgerFilter] = useState<'all' | 'in' | 'out'>('all');
  const [moneySearch, setMoneySearch] = useState('');

  // Client Directory search and filter
  const [clientSearch, setClientSearch] = useState('');
  const [clientCountryFilter, setClientCountryFilter] = useState('all');

  // Contacts Hub filter & search
  const [contactsFilter, setContactsFilter] = useState<'all' | 'clients' | 'verifiers' | 'ground' | 'hq'>('all');
  const [contactsSearch, setContactsSearch] = useState('');
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const handleCopyContact = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedContact(label);
    setToastMessage(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedContact(null), 2500);
  };

  const handleOpenAssignModal = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    setAssigningReqId(reqId);
    if (target?.assignedAgent) {
      setSelectedAgentId(target.assignedAgent.id);
    } else {
      setSelectedAgentId(agents[0]?.id || '');
    }
    setScheduledDate(target?.scheduledVisitDate || '2026-10-14');
    setConflictNotes(target?.conflictOfInterestCheck?.notes || 'Agent signed conflict-of-interest disclosure; verified zero financial, family, or clan relation to contractor or landowner.');
    setConflictConfirmed(true);
  };

  const handleConfirmAssignment = () => {
    if (!assigningReqId) return;
    if (!conflictConfirmed) {
      setToastMessage('Error: Conflict-of-interest clearance must be verified before deploying verifier.');
      return;
    }
    assignAgent(assigningReqId, selectedAgentId, scheduledDate, conflictNotes);
    const assignedAgentObj = agents.find(a => a.id === selectedAgentId);
    setToastMessage(`Success: Ground verifier ${assignedAgentObj?.name || selectedAgentId} deployed for mission ${assigningReqId}!`);
    setAssigningReqId(null);
  };

  // Update QA form when active request changes
  const handleSelectRequest = (id: string) => {
    setSelectedReqId(id);
    const req = requests.find(r => r.id === id);
    if (req) {
      setQaStatus(req.status);
      setQaFindings(req.qaReview?.findingsSummary || '');
      setQaRecommendation(req.qaReview?.recommendation || '');
      setQaRecommendationType(req.qaReview?.recommendationType || (req.status === 'observed' ? 'VERIFIED' : req.status === 'partly_observed' ? 'PARTIALLY_VERIFIED' : 'REQUIRES_FURTHER_INVESTIGATION'));
      setStopPaymentAlert(req.paymentDecisionRecord?.stopPaymentAlert || false);
      setContradictionsList(req.qaReview?.contradictions || []);
      setUncertaintiesList(req.qaReview?.whatCouldNotBeVerified || []);
    }
  };

  const handleAddContradiction = () => {
    if (contradictionInput.trim()) {
      setContradictionsList(prev => [...prev, contradictionInput.trim()]);
      setContradictionInput('');
    }
  };

  const handleAddUncertainty = () => {
    if (uncertaintyInput.trim()) {
      setUncertaintiesList(prev => [...prev, uncertaintyInput.trim()]);
      setUncertaintyInput('');
    }
  };

  const handleSaveQAReview = () => {
    if (!activeReq) return;
    submitQAReview(activeReq.id, {
      findings: qaFindings || 'Inspection completed according to brief.',
      contradictions: contradictionsList,
      uncertainties: uncertaintiesList,
      recommendation: qaRecommendation || 'Proceed according to client discretion.',
      status: qaStatus,
      stopPayment: stopPaymentAlert,
      recommendationType: qaRecommendationType,
    });
    setToastMessage(`QA Review and official findings published to Client Portal for ${activeReq.id}!`);
  };

  const handleResolveDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingDisputeId) return;
    resolveDispute(resolvingDisputeId, adminDisputeNotes || 'Senior coordinator re-examined all telemetry and validated resolution.', disputeResolutionAction);
    setToastMessage(`Dispute ${resolvingDisputeId} resolved successfully.`);
    setResolvingDisputeId(null);
    setAdminDisputeNotes('');
  };

  const handleRequestAdditionalInfo = () => {
    if (!activeReq) return;
    if (!additionalInfoNotes.trim()) {
      setToastMessage('Please specify what additional photos, measurements, or clarifications are required.');
      return;
    }
    const res = advanceRequestStatus(activeReq.id, 'ADDITIONAL_INFORMATION_REQUIRED', additionalInfoNotes.trim());
    if (res.success) {
      setToastMessage(`Requested additional evidence for ${activeReq.id}. Field verifier notified.`);
      setShowAdditionalInfoForm(false);
      setAdditionalInfoNotes('');
    } else {
      setToastMessage(res.error || 'Failed to update status.');
    }
  };

  const assigningRequest = assigningReqId ? requests.find(r => r.id === assigningReqId) : null;
  const confidenceData = activeReq ? calculateConfidenceScore(activeReq) : null;

  // Kenya Hubs Data for Regional Map
  const kenyaHubs = [
    {
      region: 'Nairobi Metropolitan',
      counties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'],
      activeAgents: 8,
      slaHours: '24h Turnaround',
      color: 'border-emerald-500 bg-emerald-50/70 text-emerald-950',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      region: 'Rift Valley & Highlands',
      counties: ['Nakuru', 'Uasin Gishu', 'Kericho', 'Nandi'],
      activeAgents: 4,
      slaHours: '48h Turnaround',
      color: 'border-blue-500 bg-blue-50/70 text-blue-950',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      region: 'Coast & Maritime Hub',
      counties: ['Mombasa', 'Kilifi', 'Kwale'],
      activeAgents: 3,
      slaHours: '48h Turnaround',
      color: 'border-amber-500 bg-amber-50/70 text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      region: 'Western & Lake Basin',
      counties: ['Kisumu', 'Kakamega', 'Bungoma', 'Siaya'],
      activeAgents: 3,
      slaHours: '48h Turnaround',
      color: 'border-teal-500 bg-teal-50/70 text-teal-950',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      region: 'Central & Mt. Kenya',
      counties: ['Nyeri', 'Meru', 'Embu', 'Kirinyaga'],
      activeAgents: 2,
      slaHours: '48h Turnaround',
      color: 'border-purple-500 bg-purple-50/70 text-purple-950',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  const filteredTriageRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(triageSearch.toLowerCase()) ||
      r.title.toLowerCase().includes(triageSearch.toLowerCase()) ||
      r.location.county.toLowerCase().includes(triageSearch.toLowerCase());
    const matchesCategory = triageCategoryFilter === 'all' || r.category === triageCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 4 Top Operational Counters
  const requiringAttentionList = requests.filter(r => hasStopPaymentWarning(r) || r.status === 'not_observed');
  const overdueList = requests.filter(r => r.urgency === 'urgent' || (r.scheduledVisitDate && r.scheduledVisitDate < '2026-10-12' && r.requestStatus !== 'COMPLETED'));
  const awaitingReviewList = requests.filter(r => (r.evidence?.length > 0 && !r.qaReview?.publishedToClient) || r.requestStatus === 'UNDER_REVIEW' || r.requestStatus === 'EVIDENCE_SUBMITTED');
  const openDisputesList = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');

  // Derived collections
  const unassignedList = requests.filter(r => !r.assignedAgent || r.requestStatus === 'AGENT_ASSIGNED');
  const clientsList = Array.from(
    new Map(
      requests.map((r) => [
        r.client.email,
        {
          id: r.client.email,
          name: r.client.name,
          email: r.client.email,
          location: r.client.locationAbroad,
          phone: r.client.phone,
          preferredCurrency: r.client.preferredCurrency || 'KES',
          requestCount: requests.filter((x) => x.client.email === r.client.email).length,
          totalPaidKES: requests
            .filter((x) => x.client.email === r.client.email && x.pricing.quoteStatus === 'paid')
            .reduce((sum, x) => sum + x.pricing.serviceFeeKES, 0),
        },
      ])
    ).values()
  );

  const totalSettledKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((s, r) => s + r.pricing.serviceFeeKES, 0);
  const totalPendingKES = requests
    .filter((r) => r.pricing.quoteStatus !== 'paid')
    .reduce((s, r) => s + r.pricing.serviceFeeKES, 0);

  // Financial Insights: Money In & Money Out
  const moneyInSettledKES = totalSettledKES;
  const moneyInPendingKES = totalPendingKES;
  
  // Platform Margin (approx 28% of gross service fees)
  const platformMarginKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((s, r) => s + (r.pricing.feeBreakdown?.platformFeeKES || Math.round(r.pricing.serviceFeeKES * 0.28)), 0);

  // Field Verifier Disbursed Payouts (completed QA-approved missions)
  const verifierPayoutsDisbursedKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid' && (r.qaReview?.publishedToClient || r.requestStatus === 'COMPLETED'))
    .reduce((s, r) => s + (r.pricing.feeBreakdown?.fieldOperationsFeeKES || Math.round(r.pricing.serviceFeeKES * 0.55)), 0);

  // Field Verifier In-Flight Payouts (escrow reserved awaiting QA review)
  const verifierPayoutsEscrowKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid' && !(r.qaReview?.publishedToClient || r.requestStatus === 'COMPLETED'))
    .reduce((s, r) => s + (r.pricing.feeBreakdown?.fieldOperationsFeeKES || Math.round(r.pricing.serviceFeeKES * 0.55)), 0);

  // Logistics & Travel Stipends Disbursed
  const travelLogisticsDisbursedKES = requests
    .filter((r) => r.pricing.quoteStatus === 'paid')
    .reduce((s, r) => s + (r.pricing.feeBreakdown?.countyTravelFeeKES || Math.round(r.pricing.serviceFeeKES * 0.17)), 0);

  // Total Money Out Disbursed
  const totalMoneyOutDisbursedKES = verifierPayoutsDisbursedKES + travelLogisticsDisbursedKES;

  // Active Escrow Under Custody (In-flight verifier fees for incomplete missions)
  const totalActiveEscrowKES = verifierPayoutsEscrowKES;

  // Net Platform Retained Operating Margin
  const netPlatformMarginKES = moneyInSettledKES - totalMoneyOutDisbursedKES - totalActiveEscrowKES;

  // Currencies Breakdown
  const supportedCurrencies: CurrencyCode[] = ['KES', 'USD', 'GBP', 'EUR', 'AED', 'CAD', 'AUD'];
  const currencyTotals = supportedCurrencies.map((c) => {
    const matchingReqs = requests.filter(r => (r.client?.preferredCurrency === c || r.pricing?.currency === c) && r.pricing?.quoteStatus === 'paid');
    const totalKES = matchingReqs.reduce((sum, r) => sum + r.pricing.serviceFeeKES, 0);
    return {
      currency: c,
      count: matchingReqs.length,
      totalKES,
    };
  }).filter(ct => ct.count > 0 || ct.currency === 'KES' || ct.currency === 'USD' || ct.currency === 'GBP');

  // Client Geographic Categorization
  const getCountryCategory = (locationAbroad?: string) => {
    if (!locationAbroad) return 'Other';
    const loc = locationAbroad.toLowerCase();
    if (loc.includes('uk') || loc.includes('london') || loc.includes('birmingham') || loc.includes('reading') || loc.includes('united kingdom')) return 'United Kingdom';
    if (loc.includes('usa') || loc.includes('tx') || loc.includes('ga') || loc.includes('wa') || loc.includes('ny') || loc.includes('united states') || loc.includes('dallas') || loc.includes('seattle') || loc.includes('atlanta')) return 'United States';
    if (loc.includes('canada') || loc.includes('toronto') || loc.includes('calgary') || loc.includes('vancouver')) return 'Canada';
    if (loc.includes('uae') || loc.includes('dubai') || loc.includes('abu dhabi')) return 'UAE & Gulf';
    if (loc.includes('germany') || loc.includes('frankfurt') || loc.includes('berlin') || loc.includes('eu') || loc.includes('europe') || loc.includes('stockholm')) return 'Germany & EU';
    if (loc.includes('australia') || loc.includes('melbourne') || loc.includes('sydney') || loc.includes('perth')) return 'Australia';
    return 'Other Diaspora';
  };

  const geoCountryMap = {
    'United Kingdom': { flag: '🇬🇧', tag: 'UK' },
    'United States': { flag: '🇺🇸', tag: 'USA' },
    'Canada': { flag: '🇨🇦', tag: 'CA' },
    'UAE & Gulf': { flag: '🇦🇪', tag: 'UAE' },
    'Germany & EU': { flag: '🇩🇪', tag: 'DE/EU' },
    'Australia': { flag: '🇦🇺', tag: 'AU' },
    'Other Diaspora': { flag: '🌍', tag: 'Global' },
  };

  const geoBreakdown = Object.entries(geoCountryMap).map(([countryName, meta]) => {
    const clientsInCountry = clientsList.filter(c => getCountryCategory(c.location) === countryName);
    const reqsInCountry = requests.filter(r => getCountryCategory(r.client?.locationAbroad) === countryName);
    const volumeKES = reqsInCountry.reduce((acc, r) => acc + (r.pricing?.serviceFeeKES || 0), 0);
    return {
      name: countryName,
      flag: meta.flag,
      tag: meta.tag,
      clientsCount: clientsInCountry.length,
      missionsCount: reqsInCountry.length,
      volumeKES,
    };
  });

  // Client Insights
  const repeatClients = clientsList.filter(c => c.requestCount > 1);
  const repeatClientRate = clientsList.length > 0 ? Math.round((repeatClients.length / clientsList.length) * 100) : 0;
  const avgOrderValueKES = requests.length > 0 ? Math.round(totalSettledKES / (requests.filter(r => r.pricing.quoteStatus === 'paid').length || 1)) : 0;

  // Ground site caretakers & contacts from active requests
  const groundContactsList = requests
    .filter(r => r.contactOnGround && r.contactOnGround.name)
    .map(r => ({
      requestId: r.id,
      county: r.location.county,
      town: r.location.town,
      landmark: r.location.landmark,
      name: r.contactOnGround.name,
      role: r.contactOnGround.role || 'Site Contact',
      phone: r.contactOnGround.phone,
      accessConfirmed: r.contactOnGround.accessConfirmed,
      notes: r.contactOnGround.notes
    }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      
      {/* Top Operational Counters (Operations Center Command Overview) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Counter 1: Requiring Attention */}
        <button 
          onClick={() => {
            if (requiringAttentionList[0]) {
              handleSelectRequest(requiringAttentionList[0].id);
              handleTabChange('reports');
            } else {
              handleTabChange('operations');
            }
          }}
          className="bg-white rounded-2xl border border-rose-200 hover:border-rose-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
            <span>Requiring Attention</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-rose-700 transition-colors">
            {requiringAttentionList.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Stop-payment & severe alerts</span>
          </div>
        </button>

        {/* Counter 2: Overdue / Critical SLA */}
        <button 
          onClick={() => handleTabChange('requests')}
          className="bg-white rounded-2xl border border-amber-200 hover:border-amber-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Overdue / Critical SLA</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-amber-700 transition-colors">
            {overdueList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Missions exceeding turnaround target
          </div>
        </button>

        {/* Counter 3: Awaiting QA Review */}
        <button 
          onClick={() => handleTabChange('reports')}
          className="bg-white rounded-2xl border border-blue-200 hover:border-blue-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>Awaiting Review</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-blue-700 transition-colors">
            {awaitingReviewList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Ground evidence submitted for QA
          </div>
        </button>

        {/* Counter 4: Open Disputes */}
        <button 
          onClick={() => handleTabChange('disputes')}
          className="bg-white rounded-2xl border border-purple-200 hover:border-purple-300 p-4 sm:p-5 shadow-xs text-left transition-all space-y-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-purple-800">
            <span>Open Disputes</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 group-hover:text-purple-700 transition-colors">
            {openDisputesList.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Client appeals pending investigation
          </div>
        </button>
      </div>

      {/* Operations Header & Tab Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                NAIROBI HQ OPERATIONS DESK
              </span>
              <span className="text-xs text-slate-400 font-medium">· Controlled Operations Register</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
              Operations Center & Register
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Triage client requests, assign vetted local verifiers, verify conflicts of interest, 
              and review ground evidence before publishing official audit findings.
            </p>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => navigate('/cockpit')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Open dedicated standalone financial & operations cockpit"
            >
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              <span>Fullscreen Cockpit ↗</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Inspect public marketing site as visitor"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Public Site ↗</span>
            </button>
            
            {/* Environment Data Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                title="Environment testing utilities"
              >
                <span>Data Tools</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {toolsMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      seedSampleData();
                      setToolsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                  >
                    Seed Test Cases
                  </button>
                  <button
                    onClick={() => {
                      resetAllData();
                      setToolsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                  >
                    Reset All Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher - Clean, horizontal scrollable without awkward truncation */}
        <div className="border-t border-slate-100 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'operations' as OperationsTab, label: 'Operations Desk', count: null },
            { id: 'requests' as OperationsTab, label: 'Requests', count: requests.length },
            { id: 'payments' as OperationsTab, label: 'Money In & Out', count: null },
            { id: 'clients' as OperationsTab, label: 'Client Base', count: clientsList.length },
            { id: 'contacts' as OperationsTab, label: 'Contacts', count: null },
            { id: 'assignments' as OperationsTab, label: 'Assignments', count: unassignedList.length },
            { id: 'agents' as OperationsTab, label: 'Verifiers', count: agents.length },
            { id: 'reports' as OperationsTab, label: 'Reports & QA', count: null },
            { id: 'disputes' as OperationsTab, label: 'Disputes', count: disputes.length },
            { id: 'analytics' as OperationsTab, label: 'Intelligence', count: null },
            { id: 'services' as OperationsTab, label: 'Services', count: null },
            { id: 'settings' as OperationsTab, label: 'Audit & Security', count: null },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-slate-800 text-slate-200 font-bold'
                        : tab.count > 0
                        ? 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                        : 'bg-slate-100/70 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg shadow-emerald-600/20 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 stroke-[3] text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-4 p-1 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: QA REVIEW & PUBLISH */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Select Request Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Select Active Inspection</span>
              <span className="text-slate-400">Queue: {requests.length}</span>
            </div>

            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {requests.map(req => {
                const isSelected = req.id === selectedReqId;
                const hasStopPayment = hasStopPaymentWarning(req);

                return (
                  <button
                    key={req.id}
                    onClick={() => handleSelectRequest(req.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-500">{req.id}</span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {req.title}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{req.location.town}, {req.location.county}</span>
                      {hasStopPayment && (
                        <span className="text-amber-700 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Stop Payment
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: QA Form & Evidence Inspection (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeReq ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {activeReq.id}
                      </span>
                      <ProcessStageBadge stage={activeReq.stage} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {activeReq.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReport(activeReq)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Preview Official Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Transparent Confidence Score Meter */}
                {confidenceData && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Verification Confidence Score: {confidenceData.overall}/100 ({confidenceData.ratingTier} CONFIDENCE)
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        confidenceData.overall >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        confidenceData.overall >= 60 ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {confidenceData.ratingTier}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          confidenceData.overall >= 80 ? 'bg-emerald-500' :
                          confidenceData.overall >= 60 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${confidenceData.overall}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                      {confidenceData.factors.slice(0, 3).map((f, i) => (
                        <div key={i} className="bg-white p-2 rounded-xl border border-slate-100">
                          <div className="font-semibold text-slate-800 truncate">{f.name}</div>
                          <div className="text-emerald-700 font-bold">{f.score}/{f.maxScore} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation Type & Official Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Recommendation Seal Stamp
                    </label>
                    <select
                      value={qaRecommendationType}
                      onChange={(e) => setQaRecommendationType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white outline-none"
                    >
                      <option value="VERIFIED">VERIFIED (Full Ground Alignment)</option>
                      <option value="PARTIALLY_VERIFIED">PARTIALLY VERIFIED (Variance Observed)</option>
                      <option value="UNABLE_TO_VERIFY">UNABLE TO VERIFY (Access/Evidence Block)</option>
                      <option value="REQUIRES_FURTHER_INVESTIGATION">REQUIRES FURTHER INVESTIGATION (Dispute/Anomaly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Verification Category Status
                    </label>
                    <select
                      value={qaStatus}
                      onChange={(e) => setQaStatus(e.target.value as VerificationStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white outline-none"
                    >
                      <option value="observed">Observed (Clear physical evidence)</option>
                      <option value="partly_observed">Partly Observed (Discrepancy / incomplete)</option>
                      <option value="not_observed">Not Observed (Milestone missing)</option>
                      <option value="cannot_confirm">Cannot Confirm (Access denied / uncertain)</option>
                    </select>
                  </div>
                </div>

                {/* Coordinator Summary Findings */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Chief Operations Findings & Narrative Summary
                  </label>
                  <textarea
                    rows={3}
                    value={qaFindings}
                    onChange={(e) => setQaFindings(e.target.value)}
                    placeholder="Synthesize physical observations, photographic alignment, and ground interviews..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Discrepancies & Contradictions List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Identified Contradictions & Variance</span>
                    <span className="text-[11px] text-slate-500 font-normal">e.g. Claimed 65% vs Ground 40%</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contradictionInput}
                      onChange={(e) => setContradictionInput(e.target.value)}
                      placeholder="e.g. 80 cement bags billed but only 40 bags physically present on site"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddContradiction}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      + Add
                    </button>
                  </div>
                  {contradictionsList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {contradictionsList.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                          <span>• {c}</span>
                          <button
                            onClick={() => setContradictionsList(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-amber-800 hover:text-amber-950 font-bold p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explicit Limitations / Uncertainties (Document 1 Standard) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>What Could NOT Be Confirmed (Document 1 Mandatory Boundary)</span>
                    <span className="text-[11px] text-slate-500 font-normal">Must state limits explicitly</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={uncertaintyInput}
                      onChange={(e) => setUncertaintyInput(e.target.value)}
                      placeholder="e.g. Structural steel tensile rating inside cured slab not certified"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUncertainty}
                      className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                    >
                      + Add
                    </button>
                  </div>
                  {uncertaintiesList.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {uncertaintiesList.map((u, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
                          <span>• {u}</span>
                          <button
                            onClick={() => setUncertaintiesList(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-slate-600 hover:text-slate-900 font-bold p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stop Payment Trigger & Action Recommendation */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stopPaymentAlert}
                      onChange={(e) => setStopPaymentAlert(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">
                        Trigger STOP PAYMENT Advisory to Client
                      </span>
                      <span className="text-[11px] text-amber-800 leading-snug block">
                        Activates red alert banner on Client Portal. Recommends client pause release of funds until contractor rectifies material discrepancy.
                      </span>
                    </div>
                  </label>

                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Action Recommendation to Client:
                    </label>
                    <input
                      type="text"
                      value={qaRecommendation}
                      onChange={(e) => setQaRecommendation(e.target.value)}
                      placeholder="e.g. Authorize partial KES 150,000 only; withhold remaining KES 300,000 pending cement audit"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Operations Decision Actions */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={handleSaveQAReview}
                      className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Approve Findings & Publish Official Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdditionalInfoForm(prev => !prev)}
                      className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Request Additional Evidence</span>
                    </button>
                  </div>

                  {showAdditionalInfoForm && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-fadeIn">
                      <div className="text-xs font-bold text-amber-900">
                        Specify Required Clarification or Additional Evidence Angles:
                      </div>
                      <textarea
                        rows={2}
                        value={additionalInfoNotes}
                        onChange={(e) => setAdditionalInfoNotes(e.target.value)}
                        placeholder="e.g. Ground photo of southern survey beacon obstructed by bush; request agent return with clearing tools and retake high-res photo..."
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleRequestAdditionalInfo}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                          Dispatch Request to Field Verifier
                        </button>
                        <button
                          onClick={() => setShowAdditionalInfoForm(false)}
                          className="px-3 py-2 text-slate-600 hover:bg-amber-100 font-semibold text-xs rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
                Select an inspection from the queue to start QA Review.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: OPERATIONS COCKPIT OR REQUESTS REGISTER */}
      {activeTab === 'operations' && opsViewMode === 'cockpit' ? (
        <div className="space-y-6">
          {/* Operations View Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">View:</span>
              <button
                onClick={() => setOpsViewMode('cockpit')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-xs cursor-pointer"
              >
                Financial & Operations Cockpit
              </button>
              <button
                onClick={() => setOpsViewMode('queue')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Missions Register Queue ({requests.length})
              </button>
            </div>
            <button
              onClick={() => navigate('/cockpit')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Open full dedicated dashboard view"
            >
              Open Fullscreen Cockpit ↗
            </button>
          </div>

          <CockpitContent
            onNavigateTab={(tab) => handleTabChange(tab as OperationsTab)}
            onRefresh={seedSampleData}
            onNewPayment={() => handleTabChange('payments')}
          />
        </div>
      ) : (activeTab === 'operations' || activeTab === 'requests') && (
        <div className="space-y-4">
          {activeTab === 'operations' && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">View:</span>
                <button
                  onClick={() => setOpsViewMode('cockpit')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Financial & Operations Cockpit
                </button>
                <button
                  onClick={() => setOpsViewMode('queue')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-xs cursor-pointer"
                >
                  Missions Register Queue ({requests.length})
                </button>
              </div>
              <button
                onClick={() => navigate('/cockpit')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Open full dedicated dashboard view"
              >
                Open Fullscreen Cockpit ↗
              </button>
            </div>
          )}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={triageSearch}
                onChange={(e) => setTriageSearch(e.target.value)}
                placeholder="Search missions by ID, title, or county..."
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={triageCategoryFilter}
                onChange={(e) => setTriageCategoryFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              >
                <option value="all">All Categories</option>
                <option value="construction">Construction</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="business">Business</option>
                <option value="family">Family Care</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Request ID</th>
                    <th className="p-3.5">Client</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Agent</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5 text-right">Controlled Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTriageRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                        No verification requests found in this view. As diaspora clients submit intake requests, they will populate here for triage, verifier dispatch, and payment verification.
                      </td>
                    </tr>
                  ) : (
                    filteredTriageRequests.map(req => {
                    const hasStop = hasStopPaymentWarning(req);
                    const urgency = req.urgency || 'standard';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          <button
                            onClick={() => navigate(`/request/${req.id}`)}
                            className="hover:underline text-emerald-800"
                            title="Open detail view"
                          >
                            {req.id}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{req.client?.name || 'Client'}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                            {req.client?.locationAbroad || req.client?.email}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 capitalize bg-slate-100 px-2 py-0.5 rounded">
                            <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                            <span>{req.category}</span>
                          </span>
                        </td>
                        <td className="p-3.5">
                          {req.assignedAgent ? (
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{req.assignedAgent.name}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignModal(req.id)}
                              className="text-amber-700 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Unassigned
                            </button>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-900">{req.location.town}</div>
                          <div className="text-[11px] text-slate-500">{req.location.county}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <StatusBadge status={req.status} size="sm" />
                            {hasStop && (
                              <div className="text-[10px] font-bold text-rose-700 flex items-center gap-0.5">
                                <ShieldAlert className="w-3 h-3" /> Stop-Payment
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            urgency === 'urgent'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : urgency === 'priority'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {urgency}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => navigate(`/request/${req.id}`)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                              title="Open request details"
                            >
                              Open Request
                            </button>
                            <button
                              onClick={() => {
                                startViewAs('client', req.client?.email || req.id, req.client?.name || 'Client', req.client?.email || '');
                                navigate('/dashboard');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors"
                              title="Preview client view"
                            >
                              View Client
                            </button>
                            {req.assignedAgent ? (
                              <button
                                onClick={() => {
                                  startViewAs('agent', req.assignedAgent!.id, req.assignedAgent!.name, req.assignedAgent?.email || '');
                                  navigate('/agent');
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                                title="Preview agent view"
                              >
                                View Agent
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenAssignModal(req.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                                title="Deploy ground verifier"
                              >
                                Deploy Agent
                              </button>
                            )}
                            <button
                              onClick={() => onOpenReport(req)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
                              title="Open verified audit report"
                            >
                              Open Report
                            </button>
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
        </div>
      )}

      {/* TAB: ASSIGNMENTS & DISPATCH QUEUE */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span>Ground Assignments & Dispatch Queue</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Assign vetted, conflict-cleared ground verifiers to active diaspora verification missions.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono">
                {unassignedList.length} Awaiting Dispatch
              </span>
            </div>

            {/* Unassigned missions queue */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Missions Awaiting Ground Verifier Deployment
              </h4>
              {unassignedList.length === 0 ? (
                <div className="py-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
                  All active verification requests currently have an assigned ground verifier.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {unassignedList.map((req) => {
                    const localMatches = agents.filter((a) => a.primaryCounties.includes(req.location.county));
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {req.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                              <CategoryIcon category={req.category} className="w-3 h-3 text-slate-500" />
                              <span>{req.category}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                              {req.urgency || 'standard'} Priority
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{req.location.town}, {req.location.county} County</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>Target Date: {req.scheduledVisitDate || 'Immediate'}</span>
                            </span>
                            {localMatches.length > 0 && (
                              <span className="text-emerald-700 font-semibold text-[11px]">
                                ✓ {localMatches.length} vetted verifiers in {req.location.county}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleOpenAssignModal(req.id)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Deploy Ground Verifier</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Currently Assigned missions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Ground Missions Deployed ({requests.filter(r => r.assignedAgent).length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {requests.filter(r => r.assignedAgent).map((req) => (
                  <div key={`assigned-${req.id}`} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{req.id}</span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">{req.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Agent: <strong>{req.assignedAgent?.name}</strong></span>
                        <span>•</span>
                        <span>{req.location.town}, {req.location.county}</span>
                        <span>•</span>
                        <span>Visit: {req.scheduledVisitDate || 'Scheduled'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenAssignModal(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Re-assign
                      </button>
                      <button
                        onClick={() => {
                          startViewAs('agent', req.assignedAgent!.id, req.assignedAgent!.name, req.assignedAgent?.email || '');
                          navigate('/agent');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition-colors"
                      >
                        View Agent View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: CLIENT BASE INSIGHTS & REGISTRY */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Diaspora Client Base Insights & Demographics</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real demographic distribution, jurisdiction footprint, and mission volumes for individual diaspora property buyers and builders.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                  {clientsList.length} Registered Diaspora Principals
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono">
                  Primary Market: 100% Individual Buyers
                </span>
              </div>
            </div>

            {/* Top 4 Client Base KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Diaspora Principals</span>
                <div className="text-2xl font-black font-mono text-slate-900">{clientsList.length}</div>
                <div className="text-[11px] text-slate-500">Verified accounts abroad</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Repeat Client Loyalty</span>
                <div className="text-2xl font-black font-mono text-emerald-800">{repeatClientRate}%</div>
                <div className="text-[11px] text-emerald-700">{repeatClients.length} clients commissioned 2+ audits</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Avg. Ticket Spend (AOV)</span>
                <div className="text-2xl font-black font-mono text-blue-800">{FORMAT_CURRENCY(avgOrderValueKES, currency)}</div>
                <div className="text-[11px] text-blue-700">Per verified site milestone</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Total Missions Commissioned</span>
                <div className="text-2xl font-black font-mono text-purple-800">{requests.length}</div>
                <div className="text-[11px] text-purple-700">Across 47 Kenyan counties</div>
              </div>
            </div>

            {/* Global Diaspora Footprint - Jurisdiction Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Geographic Diaspora Footprint (UK, USA, Canada, UAE, Germany, Australia)</span>
                </h4>
                <span className="text-[11px] text-slate-400">Live Client Clusters</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {geoBreakdown.map((geo) => (
                  <div
                    key={geo.name}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      geo.clientsCount > 0
                        ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                        : 'bg-slate-50/60 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{geo.flag}</div>
                    <div className="text-xs font-bold text-slate-900 truncate" title={geo.name}>
                      {geo.name}
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-1 font-mono text-xs">
                      <span className="font-bold text-emerald-700">{geo.clientsCount}</span>
                      <span className="text-slate-400 text-[10px]">clients</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {geo.missionsCount} missions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client Registry & Directory Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Individual Diaspora Client Registry</h4>
                <p className="text-xs text-slate-500">
                  Client profiles with direct HQ contact lines, lifetime verification volume, and portal simulation tools.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search client name, email, city..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-52 sm:w-60"
                  />
                </div>

                <select
                  value={clientCountryFilter}
                  onChange={(e) => setClientCountryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Jurisdictions</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom</option>
                  <option value="United States">🇺🇸 United States</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="UAE & Gulf">🇦🇪 UAE & Gulf</option>
                  <option value="Germany & EU">🇩🇪 Germany & EU</option>
                  <option value="Australia">🇦🇺 Australia</option>
                  <option value="Other Diaspora">🌍 Other Diaspora</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Diaspora Principal</th>
                    <th className="p-3">Residency Abroad</th>
                    <th className="p-3">HQ Contact Line (Admin View)</th>
                    <th className="p-3">Currency</th>
                    <th className="p-3">Missions</th>
                    <th className="p-3">Total Volume Paid</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientsList
                    .filter((c) => {
                      const matchesSearch =
                        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
                        c.location.toLowerCase().includes(clientSearch.toLowerCase());
                      const matchesCountry =
                        clientCountryFilter === 'all' || getCountryCategory(c.location) === clientCountryFilter;
                      return matchesSearch && matchesCountry;
                    })
                    .map((client) => {
                      const geoMeta = geoCountryMap[getCountryCategory(client.location) as keyof typeof geoCountryMap] || geoCountryMap['Other Diaspora'];

                      return (
                        <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{geoMeta.flag}</span>
                              <div>
                                <span>{client.name}</span>
                                <div className="text-[10px] text-slate-400 font-normal">Individual Buyer</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {client.location}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{client.email}</span>
                                <button
                                  onClick={() => handleCopyContact(client.email, client.email)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 ml-1 font-semibold"
                                >
                                  {copiedContact === client.email ? '✓' : 'Copy'}
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{client.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">
                            {client.preferredCurrency}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-xs border border-emerald-200">
                              {client.requestCount} {client.requestCount === 1 ? 'Mission' : 'Missions'}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {FORMAT_CURRENCY(client.totalPaidKES, currency)}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                              Active Principal
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  startViewAs('client', client.id, client.name, client.email);
                                  navigate('/dashboard');
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                title="Experience dashboard as this client"
                              >
                                View Portal
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS & FINANCIAL TREASURY COCKPIT (MONEY IN / MONEY OUT) */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Executive Financial Insights Ribbon */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Money In & Money Out — Financial & Treasury Cockpit</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time ledger of diaspora client inflows, escrow custody, currency split, and field verifier payout disbursements.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono">
                  100% Cleared via Nairobi HQ
                </span>
              </div>
            </div>

            {/* Top 4 Financial Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Money In */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Gross Money In (Cleared)
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-900">
                  {FORMAT_CURRENCY(moneyInSettledKES, currency)}
                </div>
                <div className="text-[11px] text-emerald-700 flex items-center justify-between">
                  <span>Settled client inspection fees</span>
                  <span className="font-mono font-bold">+{requests.filter(r => r.pricing.quoteStatus === 'paid').length} Invoices</span>
                </div>
              </div>

              {/* Card 2: Money Out */}
              <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 sm:p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                    Money Out (Disbursed)
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-rose-900">
                  {FORMAT_CURRENCY(totalMoneyOutDisbursedKES, currency)}
                </div>
                <div className="text-[11px] text-rose-700 flex items-center justify-between">
                  <span>Verifier payouts + logistics</span>
                  <span className="font-mono font-bold">Cleared post QA</span>
                </div>
              </div>

              {/* Card 3: Escrow Pending QA */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Active In-Flight Escrow
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Wallet className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-blue-900">
                  {FORMAT_CURRENCY(totalActiveEscrowKES, currency)}
                </div>
                <div className="text-[11px] text-blue-700 flex items-center justify-between">
                  <span>Reserved verifier fees</span>
                  <span className="font-mono font-bold">Awaiting QA signoff</span>
                </div>
              </div>

              {/* Card 4: Platform Net Margin */}
              <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    Retained Platform Margin
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-purple-900">
                  {FORMAT_CURRENCY(platformMarginKES, currency)}
                </div>
                <div className="text-[11px] text-purple-700 flex items-center justify-between">
                  <span>Net Retained Margin</span>
                  <span className="font-mono font-bold">{FORMAT_CURRENCY(netPlatformMarginKES, currency)}</span>
                </div>
              </div>
            </div>

            {/* Invariant & Governance Safety Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Pending Invoices</span>
                  <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(moneyInPendingKES, currency)}</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Awaiting Settlement</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Commingled Funds Risk</span>
                  <span className="font-mono font-bold text-emerald-700">0.00 KES</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Strict Invariant Pass</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">County Travel Logistics</span>
                  <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(travelLogisticsDisbursedKES, currency)}</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Fuel & Mileage Disbursed</span>
              </div>
            </div>

            {/* Multi-Currency Treasury Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Multi-Currency Treasury Intake Matrix</span>
                </span>
                <span className="text-[10px] text-slate-400">Foreign Exchange Settlement at Nairobi HQ</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', rail: 'M-Pesa STK / Paybill' },
                  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rail: 'Stripe / Cards / ACH' },
                  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rail: 'UK Faster Payments' },
                  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rail: 'SEPA / Cards' },
                  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rail: 'Gulf Debit Cards' },
                  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rail: 'Interac / Cards' },
                  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rail: 'Cards / Wire' },
                ].map((curr) => {
                  const currData = currencyTotals.find(c => c.currency === curr.code);
                  return (
                    <div key={curr.code} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-center space-y-0.5">
                      <div className="text-xs flex items-center justify-center gap-1">
                        <span>{curr.flag}</span>
                        <strong className="text-slate-900 font-mono">{curr.code}</strong>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-800">
                        {currData ? `${currData.count} Invoices` : '0 Invoices'}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate" title={curr.rail}>
                        {curr.rail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unified Ledger Section: Money In & Money Out */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Audit Settlement & Payout Ledger</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    {requests.length} Total Entries
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  Itemized audit trail of customer invoice collections (Money In) and verifier field payouts (Money Out).
                </p>
              </div>

              {/* View Toggles & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setMoneyLedgerFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      moneyLedgerFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All Entries
                  </button>
                  <button
                    onClick={() => setMoneyLedgerFilter('in')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      moneyLedgerFilter === 'in' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ArrowDownLeft className="w-3 h-3" />
                    <span>Money In</span>
                  </button>
                  <button
                    onClick={() => setMoneyLedgerFilter('out')}
                    className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                      moneyLedgerFilter === 'out' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Money Out</span>
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={moneySearch}
                    onChange={(e) => setMoneySearch(e.target.value)}
                    placeholder="Search invoice, client, agent..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 sm:w-56"
                  />
                </div>
              </div>
            </div>

            {/* Money In Ledger Table */}
            {(moneyLedgerFilter === 'all' || moneyLedgerFilter === 'in') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50/60 px-3.5 py-2 rounded-xl border border-emerald-100">
                  <span className="flex items-center gap-1.5">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
                    <span>MONEY IN: Client Inflow Settlements Ledger</span>
                  </span>
                  <span className="font-mono text-[11px]">
                    Total Cleared: {FORMAT_CURRENCY(moneyInSettledKES, currency)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Invoice Ref</th>
                        <th className="p-3">Diaspora Principal</th>
                        <th className="p-3">Category & County</th>
                        <th className="p-3">Payment Rail</th>
                        <th className="p-3">Gross Fee</th>
                        <th className="p-3">Settlement Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests
                        .filter((r) => {
                          if (!moneySearch) return true;
                          return (
                            r.id.toLowerCase().includes(moneySearch.toLowerCase()) ||
                            r.client?.name?.toLowerCase().includes(moneySearch.toLowerCase()) ||
                            r.location.county.toLowerCase().includes(moneySearch.toLowerCase())
                          );
                        })
                        .map((req) => {
                          const isPaid = req.pricing.quoteStatus === 'paid';
                          const hasStop = hasStopPaymentWarning(req);
                          return (
                            <tr key={`in-${req.id}`} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-3 font-mono font-bold text-slate-900">
                                <div>INV-{req.id}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{req.scheduledVisitDate || '2026-10-12'}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{req.client?.name}</div>
                                <div className="text-[10px] text-slate-500">{req.client?.locationAbroad}</div>
                              </td>
                              <td className="p-3">
                                <div className="capitalize font-semibold text-slate-800">{req.category}</div>
                                <div className="text-[10px] text-slate-500">{req.location.county} County</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                  {req.client?.preferredCurrency === 'KES' ? 'M-Pesa STK Push' : 'Stripe / Int’l Card'}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {FORMAT_CURRENCY(req.pricing.serviceFeeKES, currency)}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    isPaid
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {isPaid ? 'Cleared & Settled' : req.pricing.quoteStatus}
                                  </span>
                                  {hasStop && (
                                    <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                      Stop-Alert
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => navigate(`/request/${req.id}`)}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Money Out Ledger Table */}
            {(moneyLedgerFilter === 'all' || moneyLedgerFilter === 'out') && (
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-rose-800 bg-rose-50/60 px-3.5 py-2 rounded-xl border border-rose-100">
                  <span className="flex items-center gap-1.5">
                    <ArrowUpRight className="w-4 h-4 text-rose-700" />
                    <span>MONEY OUT: Field Verifier Payouts & Travel Disbursements</span>
                  </span>
                  <span className="font-mono text-[11px]">
                    Total Cleared Disbursements: {FORMAT_CURRENCY(totalMoneyOutDisbursedKES, currency)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Payout Voucher</th>
                        <th className="p-3">Assigned Verifier</th>
                        <th className="p-3">Mission & County</th>
                        <th className="p-3">Verifier Fee</th>
                        <th className="p-3">Travel Stipend</th>
                        <th className="p-3">Total Payout</th>
                        <th className="p-3">Disbursement Rail</th>
                        <th className="p-3">QA Payout Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests
                        .filter((r) => Boolean(r.assignedAgent))
                        .filter((r) => {
                          if (!moneySearch) return true;
                          return (
                            r.id.toLowerCase().includes(moneySearch.toLowerCase()) ||
                            r.assignedAgent?.name?.toLowerCase().includes(moneySearch.toLowerCase()) ||
                            r.location.county.toLowerCase().includes(moneySearch.toLowerCase())
                          );
                        })
                        .map((req) => {
                          const isCleared = req.pricing.quoteStatus === 'paid' && (req.qaReview?.publishedToClient || req.requestStatus === 'COMPLETED');
                          const verifierFee = req.pricing.feeBreakdown?.fieldOperationsFeeKES || Math.round(req.pricing.serviceFeeKES * 0.55);
                          const travelFee = req.pricing.feeBreakdown?.countyTravelFeeKES || Math.round(req.pricing.serviceFeeKES * 0.17);
                          const totalPayout = verifierFee + travelFee;

                          return (
                            <tr key={`out-${req.id}`} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-3 font-mono font-bold text-slate-900">
                                <div>PAY-{req.id}</div>
                                <div className="text-[10px] text-slate-400 font-normal">{req.scheduledVisitDate || '2026-10-14'}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{req.assignedAgent?.name}</div>
                                <div className="text-[10px] text-slate-500">{req.assignedAgent?.badgeLevel}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-800 font-mono">{req.id}</div>
                                <div className="text-[10px] text-slate-500">{req.location.county} ({req.location.town})</div>
                              </td>
                              <td className="p-3 font-mono text-slate-800">
                                {FORMAT_CURRENCY(verifierFee, currency)}
                              </td>
                              <td className="p-3 font-mono text-slate-600">
                                {FORMAT_CURRENCY(travelFee, currency)}
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {FORMAT_CURRENCY(totalPayout, currency)}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  M-Pesa B2C
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  isCleared
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                  {isCleared ? 'DISBURSED (QA Cleared)' : 'ESCROW (Pending QA Review)'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CENTRALIZED CONTACTS & GROUND OPERATIONS DIRECTORY */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Header & Safeguarding Notice */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span>Centralized Administrative Contacts & Operations Directory</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Full communication directory for diaspora principals, licensed verifiers, site caretakers, and Nairobi HQ escalation personnel.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold font-mono">
                Admin Exclusive View
              </span>
            </div>

            {/* Safeguarding Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="leading-snug space-y-0.5">
                <span className="font-bold text-amber-900 block">Strict Zero-Contact-Leak Policy Enforced:</span>
                <p className="text-[11px] text-amber-800">
                  Field Verifiers are prohibited from accessing diaspora client contact details. Clients are prohibited from accessing agent direct contact lines. This separation ensures uncompromised verification integrity and eliminates off-platform collusion.
                </p>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all' as const, label: 'All Contacts' },
                  { id: 'clients' as const, label: `Diaspora Principals (${clientsList.length})` },
                  { id: 'verifiers' as const, label: `Licensed Verifiers (${agents.length})` },
                  { id: 'ground' as const, label: `Ground Caretakers (${groundContactsList.length})` },
                  { id: 'hq' as const, label: 'Nairobi HQ Operations (4)' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setContactsFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      contactsFilter === pill.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={contactsSearch}
                  onChange={(e) => setContactsSearch(e.target.value)}
                  placeholder="Search name, phone, email, county..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-52 sm:w-60"
                />
              </div>
            </div>
          </div>

          {/* Directory Content Tables */}

          {/* 1. Diaspora Principals Registry */}
          {(contactsFilter === 'all' || contactsFilter === 'clients') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Individual Diaspora Principals Directory</span>
                </h4>
                <span className="text-xs font-mono text-slate-500">{clientsList.length} Contacts</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Principal Name</th>
                      <th className="p-3">Residency Abroad</th>
                      <th className="p-3">Telephone (Admin Direct)</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Preferred Currency</th>
                      <th className="p-3">Missions</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientsList
                      .filter((c) => {
                        if (!contactsSearch) return true;
                        return (
                          c.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          c.email.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          c.phone.includes(contactsSearch) ||
                          c.location.toLowerCase().includes(contactsSearch.toLowerCase())
                        );
                      })
                      .map((c) => (
                        <tr key={`c-dir-${c.id}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-bold text-slate-900">{c.name}</td>
                          <td className="p-3 text-slate-600">{c.location}</td>
                          <td className="p-3 font-mono font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{c.phone}</span>
                              <button
                                onClick={() => handleCopyContact(c.phone, `${c.name} phone`)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                {copiedContact === `${c.name} phone` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{c.email}</span>
                              <button
                                onClick={() => handleCopyContact(c.email, `${c.name} email`)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                {copiedContact === `${c.name} email` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">{c.preferredCurrency}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">{c.requestCount}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                startViewAs('client', c.id, c.name, c.email);
                                navigate('/dashboard');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                            >
                              View Portal
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Licensed Field Verifiers Directory */}
          {(contactsFilter === 'all' || contactsFilter === 'verifiers') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Licensed Field Verifiers Directory (Kenya Ground Roster)</span>
                </h4>
                <span className="text-xs font-mono text-slate-500">{agents.length} Verifiers</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Field Verifier</th>
                      <th className="p-3">County Coverage</th>
                      <th className="p-3">Mobile (M-Pesa Payout Line)</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Accreditation Badge</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Conflict Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agents
                      .filter((a) => {
                        if (!contactsSearch) return true;
                        return (
                          a.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          a.email.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          a.phone.includes(contactsSearch) ||
                          a.primaryCounties.some(pc => pc.toLowerCase().includes(contactsSearch.toLowerCase()))
                        );
                      })
                      .map((agent) => (
                        <tr key={`agt-dir-${agent.id}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <img
                                src={agent.avatarUrl}
                                alt={agent.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <span>{agent.name}</span>
                                <div className="text-[10px] text-slate-400 font-mono font-normal">{agent.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-medium">
                              {agent.primaryCounties.join(', ')}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{agent.phone}</span>
                              <button
                                onClick={() => handleCopyContact(agent.phone, `${agent.name} phone`)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                {copiedContact === `${agent.name} phone` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{agent.email}</span>
                              <button
                                onClick={() => handleCopyContact(agent.email, `${agent.name} email`)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                {copiedContact === `${agent.name} email` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-700">{agent.badgeLevel}</td>
                          <td className="p-3 font-semibold text-emerald-700">★ {agent.rating} ({agent.totalInspections})</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              SIGNED & VERIFIED
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Ground Site Contacts & Caretakers */}
          {(contactsFilter === 'all' || contactsFilter === 'ground') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Ground Site Caretakers & Local Contacts Directory</span>
                </h4>
                <span className="text-xs font-mono text-slate-500">{groundContactsList.length} Contacts</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Site Contact / Caretaker</th>
                      <th className="p-3">Role On Ground</th>
                      <th className="p-3">County & Landmark</th>
                      <th className="p-3">Mission ID</th>
                      <th className="p-3">Phone Line</th>
                      <th className="p-3">Access Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groundContactsList
                      .filter((gc) => {
                        if (!contactsSearch) return true;
                        return (
                          gc.name.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          gc.role.toLowerCase().includes(contactsSearch.toLowerCase()) ||
                          gc.phone.includes(contactsSearch) ||
                          gc.county.toLowerCase().includes(contactsSearch.toLowerCase())
                        );
                      })
                      .map((gc) => (
                        <tr key={`gc-${gc.requestId}-${gc.phone}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-bold text-slate-900">{gc.name}</td>
                          <td className="p-3 text-slate-700 font-medium">{gc.role}</td>
                          <td className="p-3 text-slate-600">
                            <div>{gc.county} ({gc.town})</div>
                            <div className="text-[10px] text-slate-400">{gc.landmark}</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-700">{gc.requestId}</td>
                          <td className="p-3 font-mono font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              <span>{gc.phone}</span>
                              <button
                                onClick={() => handleCopyContact(gc.phone, `${gc.name} phone`)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                              >
                                {copiedContact === `${gc.name} phone` ? '✓' : 'Copy'}
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              gc.accessConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {gc.accessConfirmed ? 'ACCESS CONFIRMED' : 'PENDING ACCESS'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Nairobi HQ Administrative Incident & Escalation Hub */}
          {(contactsFilter === 'all' || contactsFilter === 'hq') && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Nairobi HQ Operations Command & Escalation Directory</span>
                </h4>
                <span className="text-xs font-mono text-purple-700 font-bold">HQ Official Channels</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    role: 'Operations Desk Lead',
                    name: 'Sarah Kamau',
                    phone: '+254 712 345 678',
                    email: 'operations@diasporaverify.com',
                    dept: 'Field Verifier Dispatch & Intake',
                  },
                  {
                    role: 'Director of QA & Compliance',
                    name: 'Dr. John Ochieng',
                    phone: '+254 723 456 789',
                    email: 'qa@diasporaverify.co.ke',
                    dept: 'Report Integrity & Audit Signoff',
                  },
                  {
                    role: 'Legal & Cadastral Counsel',
                    name: 'Advocate Mercy Njoroge',
                    phone: '+254 734 567 890',
                    email: 'legal@diasporaverify.co.ke',
                    dept: 'Title Deed & Registry Oversight',
                  },
                  {
                    role: 'Data Protection Officer (ODPC)',
                    name: 'Evans Mwangi',
                    phone: '+254 745 678 901',
                    email: 'dpo@diasporaverify.co.ke',
                    dept: 'Kenya DPA 2019 / GDPR Compliance',
                  },
                ].map((officer) => (
                  <div key={officer.role} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                      {officer.role}
                    </span>
                    <div className="font-bold text-sm text-slate-900">{officer.name}</div>
                    <div className="text-[11px] text-slate-500">{officer.dept}</div>
                    <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs font-mono">
                      <div className="text-slate-800 flex items-center justify-between">
                        <span>{officer.phone}</span>
                        <button
                          onClick={() => handleCopyContact(officer.phone, officer.name)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                        >
                          {copiedContact === officer.name ? '✓' : 'Copy'}
                        </button>
                      </div>
                      <div className="text-slate-600 truncate text-[11px]">{officer.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANALYTICS & KENYA OPERATIONS MAP */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Kenya Ground Operations Coverage & Regional Density</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time verifier network deployment and active inspection clusters across Kenya's 47 counties.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Filter by Hub:</span>
                <select
                  value={selectedCountyFilter}
                  onChange={(e) => setSelectedCountyFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none"
                >
                  <option value="all">All Operational Hubs</option>
                  {kenyaHubs.map(h => (
                    <option key={h.region} value={h.region}>{h.region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regional Hub Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kenyaHubs
                .filter(h => selectedCountyFilter === 'all' || h.region === selectedCountyFilter)
                .map((hub, i) => {
                  const hubRequests = requests.filter(r => hub.counties.includes(r.location.county));
                  
                  return (
                    <div key={i} className={`p-4 rounded-2xl border ${hub.color} space-y-3 shadow-sm`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm">{hub.region}</div>
                          <div className="text-[11px] text-slate-600">
                            {hub.counties.join(', ')}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hub.badgeColor}`}>
                          {hub.slaHours}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Vetted Agents</span>
                          <span className="font-bold text-slate-900">{hub.activeAgents} Officers</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Active Missions</span>
                          <span className="font-bold text-slate-900">{hubRequests.length} Inspections</span>
                        </div>
                      </div>

                      {hubRequests.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Active Tasks:
                          </span>
                          {hubRequests.slice(0, 2).map(hr => (
                            <div key={hr.id} className="text-[11px] bg-white/80 p-1.5 rounded-lg border border-slate-200/50 flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-700">{hr.id}</span>
                              <span className="truncate ml-1 text-slate-600">{hr.location.town}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VETTED AGENTS ROSTER */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agt) => (
              <div key={agt.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={agt.avatarUrl}
                    alt={agt.name}
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{agt.name}</h3>
                    <div className="text-xs text-blue-600 font-semibold">{agt.badgeLevel}</div>
                    <div className="text-[11px] text-slate-400">★ {agt.rating} • {agt.totalInspections} field audits</div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Licensed Counties: </span>
                    {agt.primaryCounties.join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Specialties: </span>
                    {agt.specialties.join(', ')}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Conflict Clearance Signed
                  </span>
                  <span className="text-slate-400 font-mono">{agt.id}</span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      startViewAs('agent', agt.id, agt.name, agt.email);
                      navigate('/agent');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    View Agent Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES & PRICING CONFIGURATION */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Services, Tariffs & County Logistics Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized fee engine ensuring transparent quoting with zero hidden surcharges.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Dynamic Engine Active
              </span>
            </div>

            {/* Service Category Base Tariffs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Service Category Base Fees (Standardized Scope)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { name: 'Construction Oversight', fee: 14500, desc: 'Perimeter photo audit, cement bag count, milestone gating' },
                  { name: 'Property & Land Inspection', fee: 12000, desc: 'Beacon search, boundary fence scan, neighbor inquiry' },
                  { name: 'Business Due Diligence', fee: 13500, desc: 'Storefront check, permit audit, inventory spot count' },
                  { name: 'Vehicle & Equipment', fee: 16000, desc: 'VIN match, digital paint gauge scan, cold engine test' },
                  { name: 'Family Welfare Safeguarding', fee: 18000, desc: 'Elderly wellbeing, clinic accompaniment, emergency contact' },
                  { name: 'Document Verification', fee: 11000, desc: 'Physical registry visit, seal & stamp verification' },
                  { name: 'Person Identity Verification', fee: 14000, desc: 'In-person meeting, physical Kenya ID examination' },
                  { name: 'Purchase Verification', fee: 13000, desc: 'Machinery spot check, serial match, invoice copy' },
                  { name: 'General Field Assistance', fee: 12500, desc: 'Physical errands, meeting attendance, document collection' },
                ].map((s, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{s.name}</span>
                      <span className="font-mono text-emerald-700">{FORMAT_CURRENCY(s.fee, currency)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* County Travel & Urgency Multipliers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* County Logistics */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  2. Regional Travel & County Dispatch Surcharges
                </h4>
                <div className="divide-y divide-slate-200/80">
                  {[
                    { county: 'Nairobi County (Metro HQ)', fee: 1500 },
                    { county: 'Kiambu County', fee: 2500 },
                    { county: 'Machakos & Kajiado Counties', fee: 3500 },
                    { county: 'Nakuru & Central Rift', fee: 6500 },
                    { county: 'Nyeri, Kirinyaga & Mt. Kenya', fee: 6000 },
                    { county: 'Mombasa & Kilifi (Coast Hub)', fee: 12500 },
                    { county: 'Kisumu & Kakamega (Western Hub)', fee: 11500 },
                    { county: 'Uasin Gishu & Nandi (North Rift)', fee: 10500 },
                  ].map((c, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <span className="text-slate-700">{c.county}</span>
                      <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(c.fee, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency & Platform Fixed Surcharges */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  3. Urgency SLAs & Platform Infrastructure Tariffs
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Standard Tier (72h SLA)</div>
                      <div className="text-[10px] text-slate-500">Regular field queue scheduling</div>
                    </div>
                    <span className="font-mono font-bold text-slate-700">+0% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Priority Tier (48h SLA)</div>
                      <div className="text-[10px] text-slate-500">Expedited county agent deployment</div>
                    </div>
                    <span className="font-mono font-bold text-amber-700">+20% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Urgent Tier (24h SLA)</div>
                      <div className="text-[10px] text-slate-500">Emergency dispatch & instant telemetry</div>
                    </div>
                    <span className="font-mono font-bold text-rose-700">+40% Base Fee</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Fixed Platform & SHA-256 Hash Archive</div>
                      <div className="text-[10px] text-slate-500">Cryptographic tamper-evidence storage</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(2000, currency)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Field Operations Allowance</div>
                      <div className="text-[10px] text-slate-500">Hardware calibration & local transport</div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{FORMAT_CURRENCY(3500, currency)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: DISPUTES RESOLUTION DESK */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Disputes & Discrepancy Escalation Desk</span>
              </h3>
              <p className="text-xs text-slate-500">
                Review formal issues filed by Diaspora Clients regarding field observations, telemetry, or contractor discrepancies.
              </p>
            </div>

            <div className="space-y-3">
              {disputes.map(disp => (
                <div key={disp.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {disp.id}
                      </span>
                      <span className="font-bold text-xs text-slate-900">
                        Mission: {disp.requestId}
                      </span>
                      <span className="text-xs text-slate-500">
                        Filed by: {disp.clientName}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      disp.status === 'OPEN' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      disp.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {disp.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-slate-800">Reason: {disp.reason}</div>
                    <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                      {disp.description}
                    </p>
                  </div>

                  {disp.status !== 'RESOLVED' ? (
                    <div>
                      {resolvingDisputeId === disp.id ? (
                        <form onSubmit={handleResolveDisputeSubmit} className="space-y-2 pt-2 border-t border-slate-200">
                          <label className="text-xs font-bold text-slate-800 block">
                            Senior Coordinator Investigation Finding:
                          </label>
                          <textarea
                            rows={2}
                            value={adminDisputeNotes}
                            onChange={(e) => setAdminDisputeNotes(e.target.value)}
                            placeholder="Detail re-inspection findings, phone interviews, or evidence validation..."
                            className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none bg-white"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={disputeResolutionAction}
                              onChange={(e) => setDisputeResolutionAction(e.target.value)}
                              placeholder="Action taken (e.g. Dispatched senior engineer; re-issued report)"
                              className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                            >
                              Resolve Dispute
                            </button>
                            <button
                              type="button"
                              onClick={() => setResolvingDisputeId(null)}
                              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingDisputeId(disp.id);
                            setAdminDisputeNotes(disp.adminNotes || '');
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Investigate & Resolve Dispute
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>Resolved:</strong> {disp.resolutionAction} ({disp.resolvedAt})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS & AUDIT TRAIL */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Sub-Roles Matrix Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Admin Sub-Roles & Granular Permissions Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Least-privilege authorization matrix dividing administrative functions into specialized operational scopes (Doc 1 & 2 Standard).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                { role: 'super_admin' as const, label: 'Super Admin', desc: 'Full administrative sovereignty & configuration' },
                { role: 'operations' as const, label: 'Operations Desk', desc: 'Request triage, verifier dispatch & dispute handling' },
                { role: 'reviewer' as const, label: 'QA Reviewer', desc: 'Ground evidence audit, contradiction analysis & publication' },
                { role: 'finance' as const, label: 'Finance & Accounts', desc: 'Invoice reconciliation, M-Pesa tariffs & audit analytics' },
                { role: 'support' as const, label: 'Client Support', desc: 'Client account management & inquiry dispute triage' },
              ].map((sub) => {
                const perms = ROLE_PERMISSIONS[sub.role] || [];
                return (
                  <div key={sub.role} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sub.label}</div>
                      <p className="text-[10px] text-slate-500 leading-snug mt-1">{sub.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Permissions ({perms.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((p) => (
                          <span key={p} className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Immutable Operations Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cryptographically trackable log of all system transitions, verifier check-ins, payments, and report approvals.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {auditLogs.length} Logged Events
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {log.performedBy.name} ({log.performedBy.role})
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{log.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Target: <strong>{log.targetResource}</strong> ({log.targetId})</span>
                    <span className="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      SHA-256 Verified
                    </span>
                  </div>

                  {log.metadata && (
                    <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded-lg border border-slate-100 truncate">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Diagnostics & Sandbox Controls */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Admin Diagnostics & Sandbox Controls</span>
              </h3>
              <p className="text-xs text-slate-500">
                Authorized HQ Admin tools to simulate end-to-end workflows or restore a pristine zero-data state.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  seedSampleData();
                  alert('Sample benchmark test case loaded for Admin QA evaluation.');
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Load Sample Test Case (Admin QA / Demo)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to purge all local requests and restore pristine production state?')) {
                    resetAllData();
                    alert('All collections purged to pristine production state.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer"
              >
                Purge to Pristine Production State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Verifier Modal with Mandatory Conflict of Interest Checklist */}
      {assigningReqId && assigningRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
                    {assigningRequest.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Step 2: Assign Ground Verifier
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Assign Vetted Verifier to Mission
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: {assigningRequest.location.town}, {assigningRequest.location.county} County
                </p>
              </div>

              <button
                onClick={() => setAssigningReqId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Agent */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                1. Select Vetted Verifier Roster
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {agents.map((agt) => {
                  const isSelected = agt.id === selectedAgentId;
                  const coversCounty = agt.primaryCounties.includes(assigningRequest.location.county);

                  return (
                    <div
                      key={agt.id}
                      onClick={() => setSelectedAgentId(agt.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={agt.avatarUrl}
                          alt={agt.name}
                          width={36}
                          height={36}
                          loading="lazy"
                          decoding="async"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {agt.name}
                            {coversCounty && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                Local County Match
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            ★ {agt.rating} • {agt.totalInspections} audits • {agt.badgeLevel}
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Visit Date */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                2. Scheduled On-Site Inspection Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Mandatory Conflict of Interest Clearance Check */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 flex-1">
                  <div className="font-bold text-amber-900">
                    Mandatory Conflict of Interest Clearance (Reference Doc 1 & 2)
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Verifier must have ZERO familial, financial, contractor, or clan relation to the site owner, contractor, or sellers.
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Coordinator Clearance Verification Notes:
                </label>
                <textarea
                  rows={2}
                  value={conflictNotes}
                  onChange={(e) => setConflictNotes(e.target.value)}
                  placeholder="Record verification of zero conflict of interest..."
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={conflictConfirmed}
                  onChange={(e) => setConflictConfirmed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-semibold text-amber-950">
                  I certify that conflict disclosure was completed and verified
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssigningReqId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                disabled={!conflictConfirmed}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                  conflictConfirmed
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm Assignment & Deploy</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
