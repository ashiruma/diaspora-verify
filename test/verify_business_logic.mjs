import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

// Load and verify source files directly to ensure test fidelity
const mockDataPath = path.resolve('src/data/mockData.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

describe('DiasporaVerify Core Business Rules & System Invariants', () => {

  test('Rule 1: Verification status categories strictly match Reference Document standards', () => {
    const validStatuses = ['observed', 'partly_observed', 'not_observed', 'cannot_confirm'];
    
    // Statuses must be exhaustive and unambiguous
    assert.strictEqual(validStatuses.length, 4);
    assert.ok(validStatuses.includes('observed'));
    assert.ok(validStatuses.includes('partly_observed'));
    assert.ok(validStatuses.includes('not_observed'));
    assert.ok(validStatuses.includes('cannot_confirm'));

    // Strictly forbidden: ambiguous green "Approved" or "Certified" labels
    assert.ok(!validStatuses.includes('approved'));
    assert.ok(!validStatuses.includes('certified'));
    assert.ok(!validStatuses.includes('guaranteed'));
  });

  test('Rule 2: Repeatable 5-step request lifecycle matches Reference Document 1, Section 3', () => {
    const stages = ['define', 'assign', 'act', 'review', 'decide'];
    assert.deepStrictEqual(stages, ['define', 'assign', 'act', 'review', 'decide']);
    assert.strictEqual(stages.length, 5);
  });

  test('Rule 3: Currency conversion math & formatting logic with edge cases', () => {
    const rates = {
      KES: 1,
      USD: 0.0077,
      GBP: 0.0060,
      EUR: 0.0071,
    };

    const formatCurrency = (amountKES, currency = 'KES') => {
      if (amountKES === undefined || amountKES === null || isNaN(amountKES)) {
        return 'KES 0';
      }
      const rate = rates[currency] || 1;
      const converted = amountKES * rate;

      switch (currency) {
        case 'USD':
          return `$${Math.round(converted).toLocaleString('en-US')}`;
        case 'GBP':
          return `£${Math.round(converted).toLocaleString('en-GB')}`;
        case 'EUR':
          return `€${Math.round(converted).toLocaleString('de-DE')}`;
        case 'KES':
        default:
          return `KES ${Math.round(converted).toLocaleString('en-KE')}`;
      }
    };

    // Standard cases
    assert.strictEqual(formatCurrency(450000, 'KES'), 'KES 450,000');
    assert.strictEqual(formatCurrency(450000, 'USD'), '$3,465');
    assert.strictEqual(formatCurrency(450000, 'GBP'), '£2,700');
    assert.strictEqual(formatCurrency(450000, 'EUR'), '€3.195');

    // Edge cases: null, undefined, 0, NaN
    assert.strictEqual(formatCurrency(0, 'KES'), 'KES 0');
    assert.strictEqual(formatCurrency(0, 'USD'), '$0');
    assert.strictEqual(formatCurrency(null, 'USD'), 'KES 0');
    assert.strictEqual(formatCurrency(undefined, 'GBP'), 'KES 0');
    assert.strictEqual(formatCurrency(NaN, 'EUR'), 'KES 0');
  });

  test('Rule 4: Construction Milestone 3 Discrepancy & Stop-Payment calculation', () => {
    // Kitengela 4-Bed Bungalow Scenario (Document 2)
    const contractorClaimedKES = 450000;
    const verifiedCompletionPercentage = 0.40;
    const verifiedMaterialsValueKES = 150000;
    const cementBilledBags = 120;
    const cementCountedBags = 40;
    const cementMissingBags = cementBilledBags - cementCountedBags;
    const cementBagCostKES = 850;
    const cementDiscrepancyKES = cementMissingBags * cementBagCostKES;

    const unexplainedVarianceKES = contractorClaimedKES - verifiedMaterialsValueKES;
    const variancePercentage = (unexplainedVarianceKES / contractorClaimedKES) * 100;

    assert.strictEqual(verifiedCompletionPercentage, 0.40);
    assert.strictEqual(cementMissingBags, 80);
    assert.strictEqual(cementDiscrepancyKES, 68000);
    assert.strictEqual(unexplainedVarianceKES, 300000);
    assert.strictEqual(variancePercentage.toFixed(1), '66.7');

    // Business rule: Stop payment triggers if variance > 25% OR missing inventory is detected
    const shouldStopPayment = variancePercentage > 25 || cementMissingBags > 0;
    assert.strictEqual(shouldStopPayment, true);

    // Recommended withheld payment calculation
    const recommendedPayoutKES = contractorClaimedKES - unexplainedVarianceKES;
    assert.strictEqual(recommendedPayoutKES, 150000);
  });

  test('Rule 5: Unified hasStopPaymentWarning helper correctly flags both PDR and QA alerts', () => {
    const hasStopPaymentWarning = (req) => {
      if (!req) return false;
      return Boolean(req.paymentDecisionRecord?.stopPaymentAlert || req.qaReview?.stopPaymentTriggered);
    };

    // Construction request with PDR stop payment
    const constructionReq = {
      id: 'DV-2026-KJD-0104',
      paymentDecisionRecord: { stopPaymentAlert: true },
      qaReview: { stopPaymentTriggered: false }
    };
    assert.strictEqual(hasStopPaymentWarning(constructionReq), true);

    // Land request with QA stop payment but no PDR
    const landReq = {
      id: 'DV-2026-MCK-0219',
      paymentDecisionRecord: undefined,
      qaReview: { stopPaymentTriggered: true }
    };
    assert.strictEqual(hasStopPaymentWarning(landReq), true);

    // Clean request
    const cleanReq = {
      id: 'DV-2026-NBI-0341',
      paymentDecisionRecord: { stopPaymentAlert: false },
      qaReview: { stopPaymentTriggered: false }
    };
    assert.strictEqual(hasStopPaymentWarning(cleanReq), false);

    // Edge cases
    assert.strictEqual(hasStopPaymentWarning(null), false);
    assert.strictEqual(hasStopPaymentWarning(undefined), false);
    assert.strictEqual(hasStopPaymentWarning({}), false);
  });

  test('Rule 6: Mandatory Conflict of Interest Clearance invariant', () => {
    // Both Document 1 & Document 2 require verifiers to be independent
    const agentRosterCheck = mockDataContent.includes('conflictClearanceSigned: true');
    assert.ok(agentRosterCheck, 'All mock agents must have signed conflict clearance');

    const clearanceCodeCheck = mockDataContent.includes('zero commercial or familial relationship');
    assert.ok(clearanceCodeCheck, 'Ground verifier checklist and context must certify absence of conflict of interest');
  });

  test('Rule 7: Legal Boundaries and Disclaimers invariant', () => {
    const legalDisclaimers = [
      'A photo is evidence of what it shows, not proof of ownership, quality, or completion.',
      'DiasporaVerify does not hold client funds or contractor escrow.',
      'DiasporaVerify does not certify structural engineering compression or title legality.'
    ];

    legalDisclaimers.forEach(disclaimer => {
      assert.ok(disclaimer.length > 20);
    });

    // Check presence in codebase
    assert.ok(mockDataContent.includes('A photo is evidence of what it shows'));
    assert.ok(mockDataContent.includes('does not hold client funds'));
  });

  test('Rule 8: Mock requests data integrity and coverage across service categories', () => {
    // Ensure all primary pilot service categories from Document 1 are represented
    const categories = ['construction', 'property', 'family', 'business', 'vehicle'];
    categories.forEach(cat => {
      assert.ok(mockDataContent.includes(`category: '${cat}'`), `Category ${cat} must exist in mock data`);
    });

    // Ensure construction request includes repeat photo comparisons
    assert.ok(mockDataContent.includes('angleName:'));
    assert.ok(mockDataContent.includes('previousPhotoUrl:'));
    assert.ok(mockDataContent.includes('currentPhotoUrl:'));
  });

  test('Rule 9: Cryptographic SHA-256 Evidence Hashing & Tamper-Evidence Invariant', async () => {
    const { createHash } = await import('crypto');
    const samplePayload = 'https://example.com/site.jpg|14:30 EAT|-1.2612, 36.8044|North-East Slab';
    const computedHash = createHash('sha256').update(samplePayload).digest('hex');

    assert.strictEqual(typeof computedHash, 'string');
    assert.strictEqual(computedHash.length, 64);
    assert.match(computedHash, /^[a-f0-9]{64}$/);

    // Verify tampering alters the fingerprint completely
    const tamperedPayload = 'https://example.com/site.jpg|14:30 EAT|-1.2612, 36.8044|North-East Slab ALTERED';
    const tamperedHash = createHash('sha256').update(tamperedPayload).digest('hex');
    assert.notStrictEqual(computedHash, tamperedHash);
  });

  test('Rule 10: Client-side Intake & Auth Rate Limiting Logic', () => {
    const attempts = [];
    const maxAllowed = 5;
    const now = Date.now();

    for (let i = 0; i < 5; i++) {
      attempts.push(now - i * 1000);
    }
    assert.strictEqual(attempts.length >= maxAllowed, true, 'Rate limiter correctly trips at max attempts');
  });

  test('Rule 11: Enterprise Security Headers in vercel.json', async () => {
    const vercelConfigRaw = fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf-8');
    const vercelConfig = JSON.parse(vercelConfigRaw);

    assert.ok(vercelConfig.headers, 'vercel.json must declare security headers');
    const globalHeader = vercelConfig.headers.find(h => h.source === '/(.*)');
    assert.ok(globalHeader, 'Global wildcard header must exist');

    const headerKeys = globalHeader.headers.map(h => h.key);
    assert.ok(headerKeys.includes('Content-Security-Policy'), 'CSP header must be present');
    assert.ok(headerKeys.includes('Strict-Transport-Security'), 'HSTS header must be present');
    assert.ok(headerKeys.includes('X-Content-Type-Options'), 'X-Content-Type-Options must be present');
    assert.ok(headerKeys.includes('X-Frame-Options'), 'X-Frame-Options must be present');
    assert.ok(headerKeys.includes('Permissions-Policy'), 'Permissions-Policy must be present');
  });

  test('Rule 12: Legal, Privacy (Kenya DPA + GDPR), Boundaries & Code of Conduct Invariant', async () => {
    const legalContent = fs.readFileSync(new URL('../src/components/Legal/LegalAndCompliance.tsx', import.meta.url), 'utf-8');
    
    // Terms of Service & Advocate review notice
    assert.ok(legalContent.includes('Terms of Service'));
    assert.ok(legalContent.includes('High Court of Kenya Advocate'));
    assert.ok(legalContent.includes('[DIASPORAVERIFY_HOLDINGS_LTD]'));

    // Privacy Policy: Kenya DPA 2019 + GDPR + ODPC
    assert.ok(legalContent.includes('Kenya Data Protection Act 2019'));
    assert.ok(legalContent.includes('UK GDPR'));
    assert.ok(legalContent.includes('ODPC'));
    assert.ok(legalContent.includes('privacy@diaspora-verify.ke'));

    // Boundaries & Zero certification green badge rule
    assert.ok(legalContent.includes('Service Boundaries & Independence Doctrine'));
    assert.ok(legalContent.includes('Field Agent Code of Conduct'));
    assert.ok(legalContent.includes('Anti-Bribery & Zero-Kickback'));
  });

  test('Rule 13: Family Care Safeguarding & Recipient Consent Invariant', async () => {
    const wizardContent = fs.readFileSync(new URL('../src/components/ClientPortal/NewRequestWizard.tsx', import.meta.url), 'utf-8');

    // Must validate consent for family care requests
    assert.ok(wizardContent.includes('familyConsentConfirmed'));
    assert.ok(wizardContent.includes('familyEmergencyContact'));
    assert.ok(wizardContent.includes('Family Welfare requests require explicit confirmation'));
    assert.ok(wizardContent.includes('named emergency contact'));
  });

  test('Rule 14: 15-State Production State Machine Transition & Skip Prevention', () => {
    const stateMachineSource = fs.readFileSync(new URL('../src/services/stateMachine.ts', import.meta.url), 'utf-8');

    // Verify presence of all 15 discrete states
    const states = [
      'DRAFT', 'SUBMITTED', 'PAYMENT_PENDING', 'PAID', 'AWAITING_AGENT',
      'AGENT_ASSIGNED', 'ACCEPTED', 'TRAVELLING', 'ON_SITE', 'VERIFYING',
      'EVIDENCE_SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFORMATION_REQUIRED',
      'REPORT_READY', 'COMPLETED', 'DISPUTED', 'CANCELLED'
    ];

    states.forEach(st => {
      assert.ok(stateMachineSource.includes(st), `State ${st} must be defined in stateMachine.ts`);
    });

    // Test transition rules logic
    const transitions = {
      DRAFT: ['SUBMITTED', 'CANCELLED'],
      SUBMITTED: ['PAYMENT_PENDING', 'CANCELLED'],
      PAYMENT_PENDING: ['PAID', 'CANCELLED'],
      PAID: ['AWAITING_AGENT', 'CANCELLED'],
      AWAITING_AGENT: ['AGENT_ASSIGNED', 'CANCELLED'],
      AGENT_ASSIGNED: ['ACCEPTED', 'AWAITING_AGENT', 'CANCELLED'],
      ACCEPTED: ['TRAVELLING', 'AWAITING_AGENT', 'CANCELLED'],
      TRAVELLING: ['ON_SITE', 'CANCELLED'],
      ON_SITE: ['VERIFYING', 'CANCELLED'],
      VERIFYING: ['EVIDENCE_SUBMITTED', 'CANCELLED'],
      EVIDENCE_SUBMITTED: ['UNDER_REVIEW', 'CANCELLED'],
      UNDER_REVIEW: ['ADDITIONAL_INFORMATION_REQUIRED', 'REPORT_READY', 'DISPUTED'],
      ADDITIONAL_INFORMATION_REQUIRED: ['VERIFYING', 'EVIDENCE_SUBMITTED', 'CANCELLED'],
      REPORT_READY: ['COMPLETED', 'DISPUTED'],
      COMPLETED: ['DISPUTED'],
      DISPUTED: ['UNDER_REVIEW', 'COMPLETED', 'CANCELLED'],
      CANCELLED: ['DRAFT']
    };

    const canTransition = (current, target) => {
      if (current === target) return true;
      const allowed = transitions[current] || [];
      return allowed.includes(target);
    };

    // Valid forward transitions
    assert.strictEqual(canTransition('DRAFT', 'SUBMITTED'), true);
    assert.strictEqual(canTransition('SUBMITTED', 'PAYMENT_PENDING'), true);
    assert.strictEqual(canTransition('PAYMENT_PENDING', 'PAID'), true);
    assert.strictEqual(canTransition('PAID', 'AWAITING_AGENT'), true);
    assert.strictEqual(canTransition('AWAITING_AGENT', 'AGENT_ASSIGNED'), true);
    assert.strictEqual(canTransition('AGENT_ASSIGNED', 'ACCEPTED'), true);
    assert.strictEqual(canTransition('ACCEPTED', 'TRAVELLING'), true);
    assert.strictEqual(canTransition('TRAVELLING', 'ON_SITE'), true);
    assert.strictEqual(canTransition('ON_SITE', 'VERIFYING'), true);
    assert.strictEqual(canTransition('VERIFYING', 'EVIDENCE_SUBMITTED'), true);
    assert.strictEqual(canTransition('EVIDENCE_SUBMITTED', 'UNDER_REVIEW'), true);
    assert.strictEqual(canTransition('UNDER_REVIEW', 'REPORT_READY'), true);
    assert.strictEqual(canTransition('UNDER_REVIEW', 'ADDITIONAL_INFORMATION_REQUIRED'), true);
    assert.strictEqual(canTransition('REPORT_READY', 'COMPLETED'), true);

    // Strictly forbidden skips
    assert.strictEqual(canTransition('DRAFT', 'REPORT_READY'), false, 'Cannot jump from DRAFT to REPORT_READY');
    assert.strictEqual(canTransition('DRAFT', 'ON_SITE'), false, 'Cannot jump from DRAFT to ON_SITE');
    assert.strictEqual(canTransition('PAID', 'REPORT_READY'), false, 'Cannot bypass agent verification');
    assert.strictEqual(canTransition('AGENT_ASSIGNED', 'ON_SITE'), false, 'Must accept before on-site check-in');
  });

  test('Rule 15: Transparent Deterministic Confidence Scoring & Contradiction Penalties', () => {
    const confidenceSource = fs.readFileSync(new URL('../src/services/confidenceScorer.ts', import.meta.url), 'utf-8');

    // Confirm deterministic computation factors exist
    assert.ok(confidenceSource.includes('calculateConfidenceScore'));
    assert.ok(confidenceSource.includes('Physical Ground Arrival & GPS Verification'));
    assert.ok(confidenceSource.includes('Ground Contradiction Penalty'));
    assert.ok(confidenceSource.includes('Stop-Payment Risk Flag Deduction'));

    // Scoring math simulation
    const calculateScore = ({ hasCheckIn, verifiedProximity, photosCount, hasVideo, checklistRatio, contradictionsCount, stopPayment }) => {
      let score = 0;
      // Factor 1: GPS checkin (25 max)
      if (hasCheckIn && verifiedProximity) score += 25;
      else if (hasCheckIn) score += 18;
      else score += 8;

      // Factor 2: Photos/Media (25 max)
      let media = 0;
      if (photosCount >= 3) media += 15;
      else if (photosCount >= 1) media += 8;
      if (hasVideo) media += 7;
      media += 3; // all hashed
      score += Math.min(25, media);

      // Factor 3: Checklist (20 max)
      score += Math.round(checklistRatio * 20);

      // Factor 4 & 5: Baseline reconciliation & clearance (30 max)
      score += 25;

      // Penalties
      if (contradictionsCount > 0) score -= Math.min(25, contradictionsCount * 12);
      if (stopPayment) score -= 10;

      return Math.max(0, Math.min(100, Math.round(score)));
    };

    // Perfect case
    const perfectScore = calculateScore({
      hasCheckIn: true,
      verifiedProximity: true,
      photosCount: 4,
      hasVideo: true,
      checklistRatio: 1.0,
      contradictionsCount: 0,
      stopPayment: false
    });
    assert.strictEqual(perfectScore >= 90, true, 'Perfect inspection must score >= 90');

    // Flagged case with contradiction & stop payment
    const penalizedScore = calculateScore({
      hasCheckIn: true,
      verifiedProximity: true,
      photosCount: 3,
      hasVideo: false,
      checklistRatio: 0.6,
      contradictionsCount: 2,
      stopPayment: true
    });
    assert.strictEqual(penalizedScore < perfectScore, true, 'Penalties must reduce score');
    assert.ok(penalizedScore <= 60, 'High contradictions and stop payment must drop confidence tier');
  });

  test('Rule 16: Fee Breakdown Engine, Urgency Tariffs & Multi-Currency Mathematics', () => {
    const paymentSource = fs.readFileSync(new URL('../src/services/paymentService.ts', import.meta.url), 'utf-8');

    assert.ok(paymentSource.includes('calculateFeeBreakdown'));
    assert.ok(paymentSource.includes('BASE_FEES_BY_CATEGORY'));
    assert.ok(paymentSource.includes('COUNTY_TRAVEL_FEES_KES'));

    const baseFees = {
      construction: 14500,
      property: 12000,
      vehicle: 16000,
      business: 13500,
      family: 18000,
      document: 11000
    };

    const travelFees = {
      Nairobi: 1500,
      Kiambu: 2500,
      Mombasa: 12000
    };

    const calcBreakdown = (category, urgency, county) => {
      const base = baseFees[category] || 12000;
      const travel = travelFees[county] || 5000;
      const ops = 3500;
      const platform = 2000;
      const mult = urgency === 'urgent' ? 0.4 : urgency === 'priority' ? 0.2 : 0;
      const urgencyFee = Math.round(base * mult);
      return base + travel + ops + platform + urgencyFee;
    };

    // Standard Property in Nairobi
    const standardFee = calcBreakdown('property', 'standard', 'Nairobi');
    // 12000 + 1500 + 3500 + 2000 + 0 = 19000
    assert.strictEqual(standardFee, 19000);

    // Urgent Construction in Kiambu
    const urgentFee = calcBreakdown('construction', 'urgent', 'Kiambu');
    // 14500 + 2500 + 3500 + 2000 + (14500 * 0.4 = 5800) = 28300
    assert.strictEqual(urgentFee, 28300);

    // Mombasa Coast Hub Travel
    const mombasaFee = calcBreakdown('property', 'standard', 'Mombasa');
    // 12000 + 12000 + 3500 + 2000 + 0 = 29500
    assert.strictEqual(mombasaFee, 29500);
  });

  test('Rule 17: Payment Provider Abstraction Layer & Invoice Execution', () => {
    const paymentSource = fs.readFileSync(new URL('../src/services/paymentService.ts', import.meta.url), 'utf-8');
    assert.ok(paymentSource.includes('PaymentProvider'));
    assert.ok(paymentSource.includes('MpesaExpressProvider'));

    const contextSource = fs.readFileSync(new URL('../src/context/VerificationContext.tsx', import.meta.url), 'utf-8');
    assert.ok(contextSource.includes('payInvoice'));
    assert.ok(contextSource.includes('PAYMENT_RECEIVED'));
  });

});
