/**
 * DiasporaVerify — Geographic Coverage Architecture & Source of Truth
 * 
 * Reconciles operational hubs with documented verifier availability:
 * - Active Pilot Hub: Nairobi Metropolitan Area (Nairobi, Kiambu, Machakos, Kajiado)
 * - Phase 2 Expansion Hubs: Nakuru, Uasin Gishu (Eldoret), Mombasa, Kisumu
 * - Extended / Case-by-Case: Other counties evaluated for feasibility & access safety
 */

export interface CountyCoverageTier {
  county: string;
  tier: 'active_pilot' | 'phase_2_expansion' | 'case_by_case';
  hub: string;
  logisticsRateTier: 'standard_metro' | 'regional_cluster' | 'custom_quote';
  description: string;
}

export const PILOT_COUNTIES = ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'] as const;

export const PHASE_2_COUNTIES = ['Nakuru', 'Uasin Gishu', 'Mombasa', 'Kisumu'] as const;

export const ALL_KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River',
  'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
] as const;

export const COVERAGE_POLICY = {
  activeHubName: 'Nairobi Metropolitan Pilot Hub',
  activeHubCounties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado'],
  activeHubDescription: 'Direct daily operations desk dispatch with dedicated vetted verifiers.',
  
  phase2HubName: 'Regional Expansion Hubs (Phase 2)',
  phase2Counties: ['Nakuru', 'Uasin Gishu (Eldoret)', 'Mombasa', 'Kisumu'],
  phase2Description: 'Scheduled weekly field inspection batches and specialist referrals.',
  
  caseByCaseDescription: 'All other Kenyan counties are reviewed individually for physical feasibility, travel logistics, and safety clearance before quote acceptance.',
  
  summaryText: 'Active pilot coverage in Nairobi, Kiambu, Machakos, and Kajiado, with phased expansion across major regional centers and case-by-case feasibility assessment nationwide.',
  
  unsupportedClaimsToAvoid: [
    'across all 47 Kenyan counties',
    'all 47 counties covered',
    'nationwide automatic coverage',
  ],
};

/**
 * Returns coverage tier and description for a given county
 */
export function getCountyCoverageTier(countyName: string): CountyCoverageTier {
  const norm = countyName.trim();
  
  if (PILOT_COUNTIES.some(c => c.toLowerCase() === norm.toLowerCase())) {
    return {
      county: norm,
      tier: 'active_pilot',
      hub: 'Nairobi Metropolitan Hub',
      logisticsRateTier: 'standard_metro',
      description: 'Active Pilot Hub — standard logistics with prompt dispatch.',
    };
  }
  
  if (PHASE_2_COUNTIES.some(c => c.toLowerCase() === norm.toLowerCase())) {
    return {
      county: norm,
      tier: 'phase_2_expansion',
      hub: 'Regional Cluster',
      logisticsRateTier: 'regional_cluster',
      description: 'Regional Expansion Hub — scheduled inspection windows.',
    };
  }
  
  return {
    county: norm,
    tier: 'case_by_case',
    hub: 'National Feasibility Pool',
    logisticsRateTier: 'custom_quote',
    description: 'Case-by-case review — quoted following coordinator feasibility and access check.',
  };
}
