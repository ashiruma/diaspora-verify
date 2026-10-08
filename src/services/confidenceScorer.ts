import type { VerificationRequest, VerificationConfidence, ConfidenceFactor } from '../types';

/**
 * Transparent Verification Confidence Score Calculator
 * Evaluates objective empirical factors from the ground evidence dossier.
 * No arbitrary AI guesswork — 100% deterministic, transparent calculation.
 */
export function calculateConfidenceScore(request: VerificationRequest): VerificationConfidence {
  const factors: ConfidenceFactor[] = [];
  let score = 0;

  // Factor 1: Physical Inspection & Location Match (Max 25 pts)
  const hasCheckIn = Boolean(request.checkInRecord);
  const checkInVerified = request.checkInRecord?.verifiedWithinRange;
  const hasGpsEvidence = request.evidence.some(e => Boolean(e.gpsCoords));

  if (hasCheckIn && checkInVerified) {
    factors.push({
      name: 'Physical Ground Arrival & GPS Verification',
      score: 25,
      maxScore: 25,
      rationale: `Agent check-in telemetry confirmed at target coordinates within verified tolerance (${request.location.gpsCoords}).`
    });
    score += 25;
  } else if (hasCheckIn || hasGpsEvidence) {
    factors.push({
      name: 'Physical Ground Arrival & GPS Verification',
      score: 18,
      maxScore: 25,
      rationale: 'GPS coordinates recorded in evidence metadata, but telemetry distance variance recorded.'
    });
    score += 18;
  } else {
    factors.push({
      name: 'Physical Ground Arrival & GPS Verification',
      score: 8,
      maxScore: 25,
      rationale: 'Physical presence reported by agent without automated GPS geo-fence lock.'
    });
    score += 8;
  }

  // Factor 2: Photographic & Multimedia Evidence Depth (Max 25 pts)
  const photoCount = request.evidence.filter(e => e.type === 'photo').length;
  const hasVideoOrAudio = request.evidence.some(e => e.type === 'video' || e.type === 'audio_interview');
  const allHashed = request.evidence.length > 0 && request.evidence.every(e => Boolean(e.sha256Hash));

  let evidencePts = 0;
  if (photoCount >= 3) evidencePts += 15;
  else if (photoCount >= 1) evidencePts += 8;

  if (hasVideoOrAudio) evidencePts += 7;
  if (allHashed) evidencePts += 3;

  evidencePts = Math.min(25, evidencePts);
  factors.push({
    name: 'Multi-Angle Photographic & Media Corroboration',
    score: evidencePts,
    maxScore: 25,
    rationale: `${photoCount} photographs captured${hasVideoOrAudio ? ', video/interview included' : ''}${allHashed ? ', with SHA-256 cryptographic fingerprints' : ''}.`
  });
  score += evidencePts;

  // Factor 3: Structured Verification Checklist Completion (Max 20 pts)
  const totalChecks = request.checklist.length;
  const passedChecks = request.checklist.filter(c => c.status === 'passed').length;
  const flaggedChecks = request.checklist.filter(c => c.status === 'flagged').length;

  let checklistPts = 0;
  if (totalChecks > 0) {
    const ratio = passedChecks / totalChecks;
    checklistPts = Math.round(ratio * 20);
  } else {
    checklistPts = 10;
  }
  factors.push({
    name: 'Structured Checklist Protocol Execution',
    score: checklistPts,
    maxScore: 20,
    rationale: `${passedChecks} of ${totalChecks} checklist protocols passed${flaggedChecks > 0 ? ` (${flaggedChecks} flagged for review)` : ''}.`
  });
  score += checklistPts;

  // Factor 4: Independent Contact & Document Reconciliation (Max 15 pts)
  let reconPts = 0;
  const contactConfirmed = request.contactOnGround?.accessConfirmed;
  const docsProvided = request.documentsProvided.length;

  if (contactConfirmed) reconPts += 8;
  if (docsProvided > 0) reconPts += 7;

  factors.push({
    name: 'Independent Contact & Document Verification',
    score: reconPts,
    maxScore: 15,
    rationale: `${contactConfirmed ? 'Site contact access confirmed' : 'Site contact unconfirmed'}, ${docsProvided} baseline documents inspected.`
  });
  score += reconPts;

  // Factor 5: Verifier Independence & Clearance (Max 15 pts)
  let agentPts = 0;
  const clearanceSigned = request.assignedAgent?.conflictClearanceSigned;
  const highRating = (request.assignedAgent?.rating || 0) >= 4.8;

  if (clearanceSigned) agentPts += 10;
  if (highRating) agentPts += 5;

  factors.push({
    name: 'Verifier Independence & Conflict Clearance',
    score: agentPts,
    maxScore: 15,
    rationale: `${clearanceSigned ? 'Signed code of conduct and zero-conflict clearance' : 'Standard clearance'}, agent rating ${request.assignedAgent?.rating || 'N/A'}.`
  });
  score += agentPts;

  // Contradiction & Uncertainty Penalties
  const contradictionsCount = request.qaReview?.contradictions?.length || 0;
  const stopPaymentActive = Boolean(request.paymentDecisionRecord?.stopPaymentAlert || request.qaReview?.stopPaymentTriggered);

  if (contradictionsCount > 0) {
    const penalty = Math.min(25, contradictionsCount * 12);
    factors.push({
      name: 'Ground Contradiction Penalty',
      score: -penalty,
      maxScore: 0,
      rationale: `QA desk identified ${contradictionsCount} physical discrepancies between claimed scope and ground observations.`
    });
    score -= penalty;
  }

  if (stopPaymentActive) {
    factors.push({
      name: 'Stop-Payment Risk Flag Deduction',
      score: -10,
      maxScore: 0,
      rationale: 'Active stop-payment alert triggered due to unverified materials or milestone delay.'
    });
    score -= 10;
  }

  // Clamp overall score to 0 - 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let ratingTier: 'HIGH' | 'MODERATE' | 'LOW' | 'INCONCLUSIVE' = 'HIGH';
  if (normalizedScore >= 80) ratingTier = 'HIGH';
  else if (normalizedScore >= 60) ratingTier = 'MODERATE';
  else if (normalizedScore >= 40) ratingTier = 'LOW';
  else ratingTier = 'INCONCLUSIVE';

  return {
    overall: normalizedScore,
    ratingTier,
    factors,
    methodologyNote: 'Calculated deterministically from GPS telemetry, multi-angle evidence hashes, checklist completion, and conflict clearance. Never fabricated or AI-hallucinated.'
  };
}
