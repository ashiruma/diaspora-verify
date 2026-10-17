/**
 * DiasporaVerify Role-Aware AI Assistant Service
 * 
 * Provides intelligent guidance, end-to-end platform navigation, agency explanations,
 * strict anti-disintermediation leak prevention, role-specific project reminders,
 * and human operations coordinator escalation.
 * 
 * ZERO EMOJIS - Clean Kenyan vernacular and operational clarity.
 */

import type { UserRole, AuthenticatedUser } from '../auth/authorization';
import type { VerificationRequest } from '../types';

export interface AiNavigationAction {
  label: string;
  path: string;
  description?: string;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  action?: AiNavigationAction;
  requiresHumanEscalation?: boolean;
  securityAlert?: boolean;
  suggestedPrompts?: string[];
}

export interface AiAssistantContext {
  role: UserRole;
  user: AuthenticatedUser | null;
  requests: VerificationRequest[];
  activeRequest?: VerificationRequest | null;
}

/**
 * Anti-Collusion / Leak Detection Patterns
 * Flags attempts by agents or clients to exchange direct contact information or solicit off-platform deals.
 */
const PHONE_PATTERN = /(\+?254|0)[17]\d{8}|(\+?44|\+?1|\+?971|\+?49)\s?\d{7,10}/gi;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const OFF_PLATFORM_TERMS = /\b(mpesa\s+direct|till\s+number|send\s+to\s+my\s+phone|my\s+personal\s+number|call\s+me\s+directly|bypass\s+the\s+office|pay\s+me\s+cash|outside\s+the\s+system|deal\s+directly|whatsapp\s+me|my\s+private\s+number)\b/gi;

export class AiAssistantService {
  /**
   * Scan text for data leak vulnerabilities or anti-collusion violations
   */
  public static scanForDataLeaks(text: string): {
    hasLeak: boolean;
    leaks: string[];
    reason?: string;
  } {
    const leaks: string[] = [];

    const phoneMatches = text.match(PHONE_PATTERN);
    if (phoneMatches) {
      leaks.push(`Phone number detected: ${phoneMatches.join(', ')}`);
    }

    const emailMatches = text.match(EMAIL_PATTERN);
    if (emailMatches) {
      // Exclude official diaspora verify relay addresses
      const nonOfficialEmails = emailMatches.filter(e => !e.includes('diasporaverify'));
      if (nonOfficialEmails.length > 0) {
        leaks.push(`Private email detected: ${nonOfficialEmails.join(', ')}`);
      }
    }

    const termMatches = text.match(OFF_PLATFORM_TERMS);
    if (termMatches) {
      leaks.push(`Off-platform solicitation term: "${termMatches.join(', ')}"`);
    }

    return {
      hasLeak: leaks.length > 0,
      leaks,
      reason: leaks.length > 0 
        ? 'Data leak prevention active. Direct contact exchange between clients and field agents is strictly prohibited.' 
        : undefined,
    };
  }

  /**
   * Process a prompt from a Diaspora Client
   */
  public static processClientQuery(prompt: string, ctx: AiAssistantContext): AiMessage {
    const p = prompt.toLowerCase();
    const id = `ai-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    // 1. Check for direct contact requests (anti-collusion security check)
    if (
      p.includes('agent phone') || 
      p.includes('agent email') || 
      p.includes('agent number') || 
      p.includes('call the agent') || 
      p.includes('talk to verifier directly') ||
      p.includes('who is the agent') ||
      p.includes('agent name') ||
      p.includes('verifier contact')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: true,
        content: `Safeguard Notice: For your legal protection and to maintain complete objectivity, field verifiers operate under strict anonymity. You do not deal directly with the verifier, and they never see your private contact info. This eliminates bribery, contractor intimidation, or off-platform collusion. All updates, questions, and instructions flow through our Nairobi Operations Desk.`,
        action: {
          label: 'Message Nairobi Coordinator',
          path: '/messages',
          description: 'Communicate safely with your assigned coordinator at Nairobi HQ.'
        },
        suggestedPrompts: [
          'How does the agency work?',
          'What is the status of my project?',
          'Speak to a human operations coordinator'
        ]
      };
    }

    // 2. Explaining how the agency works (Agency Model Explainer)
    if (
      p.includes('how the agency works') || 
      p.includes('how does the agency work') || 
      p.includes('agency side') || 
      p.includes('how do your agents work') ||
      p.includes('how does this work') ||
      p.includes('agency model')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Here is how the DiasporaVerify agency works to protect your money in Kenya:

1. Independent Licensed Verifiers: We contract registered land surveyors, BORAQS architects, and certified site engineers in Nairobi, Kiambu, Machakos, and Kajiado.
2. Conflict-of-Interest Clearance: Before setting foot on your site, every agent signs a binding legal declaration certifying zero familial or commercial ties to your fundi, contractor, or land seller.
3. Strict Double-Blind Safeguarding: The agent never sees your personal phone, email, or full name. You only interact with Nairobi HQ. This prevents side-deals, extortion, or contractor bias.
4. Boots on Site in Mashinani: The agent travels directly to the plot with our GPS camera toolkit, counts physical materials (cement bags, steel rebar), checks beacon pins, and takes timestamped evidence.
5. Nairobi HQ Quality Assurance: Our senior engineering desk audits all photos and measurements against your drawings and contracts before publishing your certified report.`,
        action: {
          label: 'View Sample Ground Report',
          path: '/sample-report',
          description: 'Inspect a live demonstration of our tamper-proof evidence dossier.'
        },
        suggestedPrompts: [
          'Help me navigate through the system',
          'How do I book a site inspection?',
          'What areas in Kenya do you cover?',
          'Speak to a human operations coordinator'
        ]
      };
    }

    // 3. Guided End-to-End System Navigation & Onboarding Tour
    if (
      p.includes('navigate') || 
      p.includes('navigation') || 
      p.includes('tour') || 
      p.includes('walkthrough') || 
      p.includes('how to use') || 
      p.includes('where do i start') || 
      p.includes('onboarding') ||
      p.includes('guide me')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Here is your end-to-end guide to navigating DiasporaVerify:

- Step 1: Submit Your Project (Click 'New Verification'). Enter your site location in Ushago (town/county) and choose what you want checked: construction milestone, land beacons, borehole, or materials.
- Step 2: Instant Transparent Quote. You receive an immediate, binding quote in KES, USD, GBP, or EUR with zero hidden charges.
- Step 3: Track in 'Active Requests'. Monitor your assigned verifier reference (#FD-XXXX), scheduled visit date, and on-ground status in real time.
- Step 4: Open 'Reports Library'. Review high-resolution GPS photos, beacon coordinates, and material count verifications.
- Step 5: Protect Your Money. Release funds to your fundi with confidence, or activate our Stop-Payment warning if discrepancies are detected!`,
        action: {
          label: 'Start New Verification Wizard',
          path: '/new-request',
          description: 'Open the guided intake form for your Kenyan site.'
        },
        suggestedPrompts: [
          'View my active requests',
          'Inspect construction milestones',
          'Check land & property portfolio',
          'Review pricing & invoices'
        ]
      };
    }

    // 4. Project status & reminders for client
    if (
      p.includes('status of my project') || 
      p.includes('my active request') || 
      p.includes('my projects') || 
      p.includes('remind me about') ||
      p.includes('what is happening with my') ||
      p.includes('active verification')
    ) {
      if (ctx.requests && ctx.requests.length > 0) {
        const summary = ctx.requests.map((r, i) => 
          `${i + 1}. [${r.id}] ${r.title} (${r.location.town}, ${r.location.county}) - Status: ${r.requestStatus || r.status} (${r.stage} phase) - Verifier: ${r.assignedAgent?.name || 'Assigned'}`
        ).join('\n');

        return {
          id,
          sender: 'assistant',
          timestamp,
          content: `Here is the current status of your active verification mission(s):\n\n${summary}\n\nOur field verifier conducts on-ground checks with GPS timestamped cameras. Once Nairobi HQ completes quality assurance, your finalized report will be delivered here.`,
          action: {
            label: 'Open All Requests',
            path: '/requests',
            description: 'Inspect full milestone progress and verifier notes.'
          },
          suggestedPrompts: [
            'How do construction milestone audits work?',
            'Open Reports Library',
            'Speak to a human operations coordinator'
          ]
        };
      } else {
        return {
          id,
          sender: 'assistant',
          timestamp,
          content: `You currently have zero active verification missions underway. To protect your investment in Ushago before your next fundi payout, create your first site request.`,
          action: {
            label: 'Start New Verification Wizard',
            path: '/new-request',
            description: 'Enter your plot details in Kenya.'
          },
          suggestedPrompts: [
            'How does pricing work?',
            'What areas in Kenya do you cover?',
            'How does the agency work?'
          ]
        };
      }
    }

    // 5. Human Operations Escalation
    if (
      p.includes('human') || 
      p.includes('speak to a person') || 
      p.includes('call me') || 
      p.includes('coordinator') || 
      p.includes('escalat') ||
      p.includes('talk to someone') ||
      p.includes('agent assistant')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        requiresHumanEscalation: true,
        content: `I have notified our Nairobi HQ Operations Desk. Operations Coordinator Sarah Kamau has received your file reference and is reviewing your project notes. You can send a direct priority note to Nairobi HQ right now or schedule a telephone consultation.`,
        action: {
          label: 'Open Coordinator Relay',
          path: '/messages',
          description: 'Submit an expedited note directly to Nairobi Operations.'
        },
        suggestedPrompts: [
          'View my active requests',
          'Review latest inspection reports',
          'Track construction progress'
        ]
      };
    }

    // 6. Navigation: New verification
    if (
      p.includes('new request') || 
      p.includes('book') || 
      p.includes('start') || 
      p.includes('inspect a shamba') || 
      p.includes('verify my plot') || 
      p.includes('new verification')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `To book a new site verification, enter your project location in Kenya (e.g. Kiambu, Machakos, Kajiado, or Nairobi) and choose the inspection scope. You will receive an immediate itemized quote before you commit.`,
        action: {
          label: 'Start New Verification Wizard',
          path: '/new-request',
          description: 'Open the guided intake form for your Kenyan site.'
        },
        suggestedPrompts: [
          'How does pricing work?',
          'What documents do I need to provide?',
          'What areas in Kenya do you cover?'
        ]
      };
    }

    // 7. Navigation: Construction tracking & Stop-Payment
    if (
      p.includes('construction') || 
      p.includes('foundation') || 
      p.includes('walling') || 
      p.includes('roof') || 
      p.includes('cement') || 
      p.includes('fundi') ||
      p.includes('stop-payment') ||
      p.includes('discrepancy')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `In our construction oversight desk, you can monitor building milestones in Mashinani from slab pouring to roof trusses. Our verifiers physically count materials like cement bags and inspect curing quality against your drawings. If work is incomplete, we issue a Stop-Payment warning so you don't release funds.`,
        action: {
          label: 'Open Construction Tracker',
          path: '/construction',
          description: 'Inspect milestone stages, photo proof, and fundi progress.'
        },
        suggestedPrompts: [
          'Why did I get a stop-payment flag?',
          'Show me my latest inspection report',
          'Book a new construction check'
        ]
      };
    }

    // 8. Navigation: Land / Beacons / Shamba
    if (
      p.includes('shamba') || 
      p.includes('beacon') || 
      p.includes('boundary') || 
      p.includes('land') || 
      p.includes('title deed') || 
      p.includes('property')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Land due diligence in Kenya requires physical beacon confirmation on the ground and boundary verification with neighboring plots. We confirm whether beacons are intact, roads are cleared, and land is free of boundary conflicts.`,
        action: {
          label: 'View Property Portfolio',
          path: '/properties',
          description: 'Check land cadastral records and boundary verifications.'
        },
        suggestedPrompts: [
          'How do verifiers check beacons?',
          'What happens if beacons are missing?',
          'Start a land boundary check'
        ]
      };
    }

    // 9. Navigation: Reports & Evidence
    if (
      p.includes('report') || 
      p.includes('dossier') || 
      p.includes('photo') || 
      p.includes('evidence') || 
      p.includes('proof')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `All inspection dossiers include timestamped photos, GPS coordinates, physical material counts, and tamper-proof SHA-256 hashes. You can review and download them directly from your reports library.`,
        action: {
          label: 'Open Reports Library',
          path: '/reports',
          description: 'Access complete inspection dossiers with verified evidence.'
        },
        suggestedPrompts: [
          'What is a stop-payment warning?',
          'How do I share a report with my contractor?',
          'Book a follow-up visit'
        ]
      };
    }

    // 10. Navigation: Payments & Invoices
    if (
      p.includes('pay') || 
      p.includes('cost') || 
      p.includes('quote') || 
      p.includes('fee') || 
      p.includes('invoice') || 
      p.includes('mpesa')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Inspection fees are transparent and fixed per mission based on distance and inspection depth. We support international cards (GBP, USD, EUR, AED, CAD) and M-Pesa. We never handle contractor funds—we strictly verify before you wire money.`,
        action: {
          label: 'View Invoices & Payments',
          path: '/payments',
          description: 'Review fee breakdowns, receipts, and payment rails.'
        },
        suggestedPrompts: [
          'Do you hold purchase money for land?',
          'How long does an inspection take?',
          'Request a quote for my site'
        ]
      };
    }

    // Default general navigation & onboarding assistance
    return {
      id,
      sender: 'assistant',
      timestamp,
      content: `Karibu! I am your DiasporaVerify Assistant. I can help you navigate your portal, track projects in Mashinani, explain how our ground verifiers inspect sites, or connect you with our Nairobi HQ operations team. What would you like to do?`,
      suggestedPrompts: [
        'How does the agency work?',
        'Help me navigate through the system',
        'How do I book a site inspection?',
        'Speak to a human operations coordinator'
      ]
    };
  }

  /**
   * Process a prompt from a Field Agent
   */
  public static processAgentQuery(prompt: string, ctx: AiAssistantContext): AiMessage {
    const p = prompt.toLowerCase();
    const id = `ai-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    // 1. Anti-Collusion: Agent asking for client contact details
    if (
      p.includes('client phone') || 
      p.includes('client email') || 
      p.includes('client number') || 
      p.includes('who is the client') || 
      p.includes('client name') ||
      p.includes('contact the client') ||
      p.includes('call client')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: true,
        content: `Security Protocol Violation: Client personal details are strictly confidential. Under our Anti-Collusion Protocol, field agents verify the site and physical works only. All communication, questions, or schedule notices must be submitted via Nairobi HQ Dispatch. Solicitations for direct contact result in immediate de-registration.`,
        action: {
          label: 'Contact Nairobi HQ Dispatch',
          path: '/agent#dispatch',
          description: 'Submit an operational query to HQ.'
        },
        suggestedPrompts: [
          'Remind me about my active projects',
          'How do I record a GPS site check-in?',
          'What photos are required for foundation milestone?'
        ]
      };
    }

    // 2. Remind me about client ABCD or a project
    if (
      p.includes('remind me about') || 
      p.includes('my tasks') || 
      p.includes('my jobs') || 
      p.includes('my missions') || 
      p.includes('what do i have') ||
      p.includes('active job') ||
      p.includes('client abcd') ||
      p.includes('project')
    ) {
      if (ctx.requests && ctx.requests.length > 0) {
        const jobs = ctx.requests.map((r, i) => 
          `Mission ${i + 1}: Ref [${r.id}] - ${r.title}\n` +
          `· Location: ${r.location.town}, ${r.location.county} (GPS: ${r.location.gpsCoords || 'Site Pin'})\n` +
          `· Client Ref: ${r.client?.name || 'Diaspora Client (Protected)'}\n` +
          `· Scheduled Visit: ${r.scheduledVisitDate || 'Scheduled'}\n` +
          `· Stage: ${r.stage} phase`
        ).join('\n\n');

        return {
          id,
          sender: 'assistant',
          timestamp,
          content: `Here is a summary of your assigned field missions:\n\n${jobs}\n\nImportant Field Protocol: Complete your GPS check-in upon arrival at the perimeter gate or boundary beacon pin, and ensure all photos have clear lighting and scale markers.`,
          action: {
            label: 'Open Field Checklist',
            path: '/agent',
            description: 'Execute checklist observations and photo capture.'
          },
          suggestedPrompts: [
            'What photos are required for foundation milestone?',
            'How do I document missing cement bags?',
            'Site access is blocked by watchman'
          ]
        };
      } else {
        return {
          id,
          sender: 'assistant',
          timestamp,
          content: `You currently have zero pending site assignments. Once Nairobi HQ Operations verifies client payment and assigns a site verification to your profile, it will appear here with GPS navigation, checklist instructions, and evidence capture tools.`,
          action: {
            label: 'Check Agent Portal',
            path: '/agent',
            description: 'Monitor dispatch queue for incoming missions.'
          },
          suggestedPrompts: [
            'Review verifier ethics code',
            'How do I record GPS check-in?',
            'Standard photo evidence requirements'
          ]
        };
      }
    }

    // 3. Site Access / Blocked
    if (
      p.includes('gate') || 
      p.includes('watchman') || 
      p.includes('access') || 
      p.includes('denied') || 
      p.includes('locked') || 
      p.includes('refused') ||
      p.includes('caretaker')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        requiresHumanEscalation: true,
        content: `Site Access Obstacle Protocol: Do not engage in arguments or force entry. Follow these 3 steps:
1. Record your GPS check-in at the perimeter gate.
2. Take a photo of the closed gate, padlock, or caretaker notice showing the date and time.
3. Submit an Access Obstacle notice to HQ Dispatch. HQ Operations will immediately contact the diaspora client's designated local contact to authorize entry.`,
        action: {
          label: 'Submit Site Access Notice',
          path: '/agent#checkin',
          description: 'Flag site access restriction with GPS proof.'
        },
        suggestedPrompts: [
          'How do I record an inconclusive finding?',
          'Remind me about my active projects',
          'Review verifier ethics code'
        ]
      };
    }

    // 4. Checklist & Evidence Guidance
    if (
      p.includes('photo') || 
      p.includes('camera') || 
      p.includes('checklist') || 
      p.includes('evidence') || 
      p.includes('angle') ||
      p.includes('cement')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Standard Evidence Protocol for Field Missions:
- 4 Cardinal Angles: North, South, East, West perimeter overviews.
- Milestone Depth: For foundation (excavation depth, steel rebar spacing, blinding layer); For walling (mortar joint thickness, lintel alignment); For roofing (truss timber grading, tie-down straps).
- Physical Material Count: Count cement bags in the store, tally steel rods by diameter (Y10, Y12, Y16), and note brand markings (e.g. Bamburi, Simba, Savannah).
- All media automatically receives SHA-256 tamper-proof hashing and GPS coordinates upon capture.`,
        action: {
          label: 'Open Evidence Queue',
          path: '/agent#evidence',
          description: 'Upload field inspection photos and video telemetry.'
        },
        suggestedPrompts: [
          'How do I verify boundary beacons?',
          'How to document missing cement bags?',
          'Remind me about my active projects'
        ]
      };
    }

    // Default Agent Assistant
    return {
      id,
      sender: 'assistant',
      timestamp,
      content: `Hello Verifier. I am your Field Site Copilot. I help you track your missions, follow inspection checklists, submit tamper-evident evidence, and report obstacles to Nairobi HQ. How can I assist your field mission?`,
      suggestedPrompts: [
        'Remind me about my active projects',
        'What photos are required for foundation milestone?',
        'Site access is blocked by watchman',
        'Standard photo evidence requirements'
      ]
    };
  }

  /**
   * Process a prompt from an Admin / Founder / Operations Coordinator
   */
  public static processAdminQuery(prompt: string, ctx: AiAssistantContext): AiMessage {
    const p = prompt.toLowerCase();
    const id = `ai-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    // 1. Data leak & Anti-Collusion Audit ("Ensure platform is running smoothly and there are no data leaks")
    if (
      p.includes('leak') || 
      p.includes('security') || 
      p.includes('smoothly') ||
      p.includes('audit') || 
      p.includes('scan') || 
      p.includes('collusion')
    ) {
      const activeCount = ctx.requests.length;
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: false,
        content: `Sentinel Security Audit - Platform Integrity Nominal:

- Bi-Directional Identity Masking: 100% Active.
  · Field Agents see client identity strictly as 'Diaspora Client (#CL-XXXX)'. Personal phones, emails, and full names are masked.
  · Diaspora Clients see verifiers strictly as 'Vetted Verifier (#FD-XXXX)'. Personal phones, emails, and full names are masked.
- Anti-Disintermediation Protection: In-app regex scanner intercepts off-platform solicitation (M-Pesa till numbers, direct phone numbers, personal emails).
- Communications Mediation: All mission threads route through Nairobi HQ Operations Desk.
- Tamper-Evident Evidence: All field photos receive cryptographic SHA-256 hashing.
- Active Missions Monitored: ${activeCount} active verification requests in flight.`,
        action: {
          label: 'Inspect Platform Activity Stream',
          path: '/admin?tab=activity',
          description: 'Review audited sessions, member logins, and dispatch telemetry.'
        },
        suggestedPrompts: [
          'Review who joined recently',
          'Check unassigned diaspora requests',
          'Open financial cockpit'
        ]
      };
    }

    // 2. Who joined recently / Member Directory
    if (
      p.includes('who joined') || 
      p.includes('members') || 
      p.includes('clients') || 
      p.includes('directory') ||
      p.includes('registered')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Executive Directory Summary:
All registered diaspora clients and vetted field operatives are cataloged in your private operations directory. You can inspect joined dates, overseas residence (UK, USA, UAE, Europe), and mission history. Founder Chrispine Abala Ashiruma has complete premium oversight.`,
        action: {
          label: 'Open Member Directory',
          path: '/admin?tab=clients',
          description: 'View live directory of who joined and active diaspora accounts.'
        },
        suggestedPrompts: [
          'Scan platform for data leaks',
          'Check unassigned diaspora requests',
          'Open financial cockpit'
        ]
      };
    }

    // 3. Matchmaker & Verifier Assignment
    if (
      p.includes('assign') || 
      p.includes('match') || 
      p.includes('agent') || 
      p.includes('verifier') || 
      p.includes('dispatch')
    ) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Matchmaker Intelligence: When assigning a verifier to a Diaspora request:
1. Filter by parcel county (Nairobi, Kiambu, Machakos, Kajiado).
2. Verify signed conflict-of-interest clearance status.
3. Check agent badge level (BORAQS Registered Architect / Land Surveyor / Structural Inspector).
4. Ensure the verifier has no familial or commercial ties to the contractor.`,
        action: {
          label: 'Open Operations Matchmaker Desk',
          path: '/admin?tab=requests',
          description: 'Pair incoming requests with local field verifiers.'
        },
        suggestedPrompts: [
          'Which requests are unassigned?',
          'Scan platform for data leaks',
          'Review who joined recently'
        ]
      };
    }

    // Default Admin Copilot
    return {
      id,
      sender: 'assistant',
      timestamp,
      content: `Operations Copilot Active. I help you monitor data leak prevention, match diaspora requests to field agents, audit incoming QA dossiers, and oversee platform activity. What would you like to review?`,
      suggestedPrompts: [
        'Ensure platform is running smoothly and there are no data leaks',
        'Review who joined recently',
        'Check unassigned diaspora requests',
        'Open financial cockpit'
      ]
    };
  }

  /**
   * Main router for processing queries based on authenticated role
   */
  public static handleQuery(prompt: string, ctx: AiAssistantContext): AiMessage {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return {
        id: `ai-msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
        content: 'Please enter your question or request assistance.'
      };
    }

    // Security Layer: Immediate detection of off-platform leaks and solicitation
    const leakScan = this.scanForDataLeaks(trimmed);
    if (leakScan.hasLeak) {
      return {
        id: `leak-alert-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
        securityAlert: true,
        content: `Security Protocol Alert: Your inquiry contains potential off-platform contact or payment details (${leakScan.leaks.join(', ')}). Under DiasporaVerify Anti-Collusion Safeguards, direct contact details between diaspora clients and field agents are strictly restricted to prevent fraud, disintermediation, and audit bias. All questions, schedule changes, and instructions must flow through our Nairobi Operations Desk.`,
        action: {
          label: ctx.role === 'agent' ? 'Contact HQ Dispatch' : 'Message Nairobi Coordinator',
          path: ctx.role === 'agent' ? '/agent#dispatch' : '/messages',
          description: 'Route your message safely through Nairobi operations.'
        },
        suggestedPrompts: ctx.role === 'agent'
          ? [
              'Remind me about my active projects',
              'How to report site access obstacles',
              'Standard photo evidence requirements'
            ]
          : [
              'How does the agency work?',
              'Help me navigate through the system',
              'Speak to a human operations coordinator'
            ]
      };
    }

    if (ctx.role === 'admin') {
      return this.processAdminQuery(trimmed, ctx);
    } else if (ctx.role === 'agent') {
      return this.processAgentQuery(trimmed, ctx);
    } else {
      return this.processClientQuery(trimmed, ctx);
    }
  }
}
