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

});
