import type { AppointmentRecord, DiasporaTimezoneDef } from '../types';

export const DIASPORA_TIMEZONES: DiasporaTimezoneDef[] = [
  {
    id: 'europe_london',
    city: 'London, United Kingdom',
    region: 'UK & Ireland',
    iana: 'Europe/London',
    standardAbbr: 'BST',
    utcOffsetHours: 1,
    nairobiDiffHours: -2 // London is 2 hours behind Nairobi
  },
  {
    id: 'america_chicago',
    city: 'Dallas / Houston / Chicago, USA',
    region: 'North America (Central)',
    iana: 'America/Chicago',
    standardAbbr: 'CDT',
    utcOffsetHours: -5,
    nairobiDiffHours: -8 // Dallas is 8 hours behind Nairobi
  },
  {
    id: 'america_new_york',
    city: 'New York / Atlanta / Toronto, USA & Canada',
    region: 'North America (Eastern)',
    iana: 'America/New_York',
    standardAbbr: 'EDT',
    utcOffsetHours: -4,
    nairobiDiffHours: -7 // New York is 7 hours behind Nairobi
  },
  {
    id: 'america_los_angeles',
    city: 'Los Angeles / Seattle, USA',
    region: 'North America (Pacific)',
    iana: 'America/Los_Angeles',
    standardAbbr: 'PDT',
    utcOffsetHours: -7,
    nairobiDiffHours: -10 // Los Angeles is 10 hours behind Nairobi
  },
  {
    id: 'europe_berlin',
    city: 'Frankfurt / Berlin / Paris / Geneva',
    region: 'Western & Central Europe',
    iana: 'Europe/Berlin',
    standardAbbr: 'CEST',
    utcOffsetHours: 2,
    nairobiDiffHours: -1 // Berlin is 1 hour behind Nairobi
  },
  {
    id: 'asia_dubai',
    city: 'Dubai / Abu Dhabi / Doha, UAE & Gulf',
    region: 'Middle East',
    iana: 'Asia/Dubai',
    standardAbbr: 'GST',
    utcOffsetHours: 4,
    nairobiDiffHours: 1 // Dubai is 1 hour ahead of Nairobi
  },
  {
    id: 'australia_sydney',
    city: 'Sydney / Melbourne, Australia',
    region: 'Australia & New Zealand',
    iana: 'Australia/Sydney',
    standardAbbr: 'AEST',
    utcOffsetHours: 10,
    nairobiDiffHours: 7 // Sydney is 7 hours ahead of Nairobi
  },
  {
    id: 'australia_perth',
    city: 'Perth, Australia',
    region: 'Western Australia',
    iana: 'Australia/Perth',
    standardAbbr: 'AWST',
    utcOffsetHours: 8,
    nairobiDiffHours: 5 // Perth is 5 hours ahead of Nairobi
  },
  {
    id: 'africa_nairobi',
    city: 'Nairobi, Kenya',
    region: 'East Africa (Operations HQ)',
    iana: 'Africa/Nairobi',
    standardAbbr: 'EAT',
    utcOffsetHours: 3,
    nairobiDiffHours: 0
  }
];

export interface SlotOption {
  time24: string; // "14:00"
  localLabel: string; // "02:00 PM"
  nairobiLabel: string; // "04:00 PM EAT"
  period: 'morning' | 'afternoon' | 'evening';
}

/**
 * Returns available consultation time slots adapted to the selected diaspora timezone
 * and calculates the corresponding Nairobi Operations Desk time.
 */
export function getAvailableSlotsForTimezone(tzDef: DiasporaTimezoneDef): SlotOption[] {
  // Standard diaspora consultation hours: 09:00 to 20:30 local time
  const rawHours = [
    { h: 9, m: 0, period: 'morning' as const },
    { h: 10, m: 30, period: 'morning' as const },
    { h: 12, m: 0, period: 'afternoon' as const },
    { h: 14, m: 0, period: 'afternoon' as const },
    { h: 15, m: 30, period: 'afternoon' as const },
    { h: 17, m: 0, period: 'afternoon' as const },
    { h: 18, m: 30, period: 'evening' as const },
    { h: 20, m: 0, period: 'evening' as const }
  ];

  return rawHours.map(slot => {
    const time24 = `${String(slot.h).padStart(2, '0')}:${String(slot.m).padStart(2, '0')}`;
    const periodAmPm = slot.h >= 12 ? 'PM' : 'AM';
    const displayH = slot.h % 12 === 0 ? 12 : slot.h % 12;
    const localLabel = `${displayH}:${String(slot.m).padStart(2, '0')} ${periodAmPm} ${tzDef.standardAbbr}`;

    // Nairobi EAT is tzDef.nairobiDiffHours ahead/behind
    // Nairobi hour = local hour - nairobiDiffHours (e.g. London 14:00 - (-2) = 16:00 EAT)
    let nairobiH = (slot.h - tzDef.nairobiDiffHours) % 24;
    if (nairobiH < 0) nairobiH += 24;
    const nairobiAmPm = nairobiH >= 12 ? 'PM' : 'AM';
    const nairobiDisplayH = nairobiH % 12 === 0 ? 12 : nairobiH % 12;
    const nairobiLabel = `${nairobiDisplayH}:${String(slot.m).padStart(2, '0')} ${nairobiAmPm} EAT`;

    return {
      time24,
      localLabel,
      nairobiLabel,
      period: slot.period
    };
  });
}

/**
 * Generates the upcoming 7 available business days starting from tomorrow
 */
export function getUpcomingBookingDates(): { dateStr: string; dayName: string; formatted: string }[] {
  const dates = [];
  const now = new Date();

  let daysAhead = 1;
  while (dates.length < 6) {
    const d = new Date(now);
    d.setDate(now.getDate() + daysAhead);
    daysAhead++;

    const dayOfWeek = d.getDay();
    // Exclude Sundays (0) to keep scheduled desk operations reliable, Saturdays allowed
    if (dayOfWeek === 0) continue;

    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    dates.push({ dateStr, dayName, formatted });
  }

  return dates;
}

/**
 * Generates an iCalendar (.ics) string for appointment import into Apple, Google, or Outlook
 */
export function generateIcsContent(appointment: AppointmentRecord): string {
  const cleanId = appointment.id.replace(/[^a-zA-Z0-9-]/g, '');
  const title = `DiasporaVerify Consultation: ${appointment.consultationTopic.toUpperCase()} in ${appointment.targetCounty}`;
  const description = `DiasporaVerify Operations Desk Consultation.\\n\\nClient: ${appointment.clientName}\\nLocation Abroad: ${appointment.clientCityAbroad} (${appointment.clientTimezone})\\nScheduled Time: ${appointment.scheduledSlotLocal} / ${appointment.scheduledSlotNairobi}\\nChannel: ${appointment.meetingChannel.toUpperCase()}\\nTarget County: ${appointment.targetCounty}\\n\\nAnti-Collusion Verification Desk · DiasporaVerify Nairobi Operations.`;

  // Format date for ICS
  const dateFormatted = appointment.scheduledDate.replace(/-/g, '');
  const dtStart = `${dateFormatted}T100000Z`;
  const dtEnd = `${dateFormatted}T104500Z`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DiasporaVerify Kenya//Consultation Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${cleanId}@diaspora-verify.ke`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'LOCATION:Nairobi Operations Desk (Video / Audio Conference)',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Generates a direct Google Calendar template web link
 */
export function generateGoogleCalendarUrl(appointment: AppointmentRecord): string {
  const title = encodeURIComponent(`DiasporaVerify Consultation: ${appointment.targetCounty} Verification`);
  const details = encodeURIComponent(
    `DiasporaVerify Consultation with Nairobi Operations Desk.\n\nProject: ${appointment.consultationTopic}\nCounty: ${appointment.targetCounty}\nLocal Time: ${appointment.scheduledSlotLocal}\nNairobi Time: ${appointment.scheduledSlotNairobi}\nChannel: ${appointment.meetingChannel.toUpperCase()}\nBooking Ref: ${appointment.id}`
  );
  const location = encodeURIComponent('Video / Audio Conference via DiasporaVerify Coordination Desk');
  const dateClean = appointment.scheduledDate.replace(/-/g, '');
  const dates = `${dateClean}T100000Z/${dateClean}T104500Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Triggers a download of the .ics file in browser
 */
export function downloadIcsFile(appointment: AppointmentRecord): void {
  const icsData = generateIcsContent(appointment);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `diaspora-verify-appointment-${appointment.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const APPOINTMENTS_STORAGE_KEY = 'diaspora_verify_appointments';

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'DV-APT-84012',
    clientName: 'David K. Maina',
    clientEmail: 'd.maina@uk-cloud.co.uk',
    clientPhone: '+44 7911 234567',
    clientTimezone: 'europe_london',
    clientCityAbroad: 'London, United Kingdom',
    consultationTopic: 'construction',
    targetCounty: 'Kiambu',
    targetTownVillage: 'Ruiru Mugutha',
    scheduledDate: '2026-10-20',
    scheduledSlotLocal: '02:00 PM BST',
    scheduledSlotNairobi: '04:00 PM EAT',
    meetingChannel: 'google_meet',
    briefNotes: 'Four-bedroom maisonette at lintel ring beam stage. Need physical inventory of timber trusses and cement bags before 2nd disbursement.',
    status: 'confirmed',
    createdAt: '2026-10-18T09:30:00Z'
  },
  {
    id: 'DV-APT-84019',
    clientName: 'Beatrice A. Ochieng',
    clientEmail: 'beatrice.ochieng@dallas-health.org',
    clientPhone: '+1 (214) 555-0198',
    clientTimezone: 'america_chicago',
    clientCityAbroad: 'Dallas, TX, USA',
    consultationTopic: 'property',
    targetCounty: 'Kisumu',
    targetTownVillage: 'Riat Hills',
    scheduledDate: '2026-10-21',
    scheduledSlotLocal: '10:30 AM CDT',
    scheduledSlotNairobi: '06:30 PM EAT',
    meetingChannel: 'whatsapp',
    briefNotes: 'Land purchase inquiry. Need surveyor boundary beacon search and neighbor verification before paying 70% land balance.',
    status: 'confirmed',
    createdAt: '2026-10-18T11:15:00Z'
  }
];

export function getStoredAppointments(): AppointmentRecord[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointmentRecord(appointment: AppointmentRecord): AppointmentRecord[] {
  const current = getStoredAppointments();
  const updated = [appointment, ...current.filter(a => a.id !== appointment.id)];
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist appointment record', err);
  }
  return updated;
}
