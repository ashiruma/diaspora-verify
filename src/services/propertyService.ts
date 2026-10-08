import type { PropertyRecord } from '../types';

export const MOCK_PROPERTIES: PropertyRecord[] = [
  {
    id: 'prop-001',
    clientId: 'usr-client-01',
    title: 'Kitengela Acacia 4-Bed Bungalow Plot 42/B',
    propertyType: 'Construction Site',
    county: 'Kajiado',
    town: 'Kitengela',
    landmark: 'Acacia Crest Academy, 1.2km off Namanga Road',
    gpsCoords: '-1.4892, 36.9583',
    beaconNumbers: ['BC-KJD-42A', 'BC-KJD-42B', 'BC-KJD-42C', 'BC-KJD-42D'],
    titleDeedRef: 'KJD/KITENGELA/42910',
    sizeAcres: 0.25,
    currentStatus: 'Under Construction',
    monitoringPlan: 'Monthly',
    lastInspectionDate: '2026-09-28',
    nextInspectionDate: '2026-10-28',
    inspectionHistoryCount: 3,
    notes: 'Active building project. Requires photographic milestone comparisons and cement inventory reconciliations.',
    verifiedImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prop-002',
    clientId: 'usr-client-01',
    title: 'Tigoni Tea Ridge 1-Acre Agricultural Parcel',
    propertyType: 'Farm / Agricultural',
    county: 'Kiambu',
    town: 'Tigoni / Limuru',
    landmark: 'Near Brackenhurst Conference Centre',
    gpsCoords: '-1.1528, 36.6811',
    beaconNumbers: ['BC-KBU-1088', 'BC-KBU-1089', 'BC-KBU-1090'],
    titleDeedRef: 'KBU/LIMURU-TIGONI/884',
    sizeAcres: 1.0,
    currentStatus: 'Farmed / Cultivated',
    monitoringPlan: 'Quarterly',
    lastInspectionDate: '2026-07-15',
    nextInspectionDate: '2026-10-15',
    inspectionHistoryCount: 2,
    notes: 'Tea bushes and perimeter cypress fencing. Verifying farm manager crop sales and fertilizer delivery.',
    verifiedImages: [
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prop-003',
    clientId: 'usr-client-01',
    title: 'Kilifi Bofa Beach Road Residential Parcel',
    propertyType: 'Residential Land',
    county: 'Kilifi',
    town: 'Kilifi Town',
    landmark: 'Bofa Beach Road, 400m from shoreline',
    gpsCoords: '-3.6121, 39.8614',
    beaconNumbers: ['BC-KLF-041', 'BC-KLF-042', 'BC-KLF-043', 'BC-KLF-044'],
    titleDeedRef: 'CR-62911/KLF',
    sizeAcres: 0.5,
    currentStatus: 'Vacant',
    monitoringPlan: 'Biannual',
    lastInspectionDate: '2026-05-10',
    nextInspectionDate: '2026-11-10',
    inspectionHistoryCount: 1,
    notes: 'Vacant plot. Risk of perimeter encroachment or illegal quarrying. Needs quarterly boundary beacon check.',
    verifiedImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

export function calculateNextInspectionDate(frequency: 'Monthly' | 'Quarterly' | 'Biannual' | 'On-Demand', fromDateStr: string = new Date().toISOString()): string {
  const from = new Date(fromDateStr);
  const daysToAdd = frequency === 'Monthly' ? 30 : frequency === 'Quarterly' ? 90 : frequency === 'Biannual' ? 180 : 14;
  from.setDate(from.getDate() + daysToAdd);
  return from.toISOString().substring(0, 10);
}
