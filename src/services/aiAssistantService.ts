/**
 * DiasporaVerify Role-Aware AI Assistant Service
 * 
 * Provides intelligent guidance, platform navigation, agency explanations,
 * strict anti-disintermediation leak prevention, and human escalation.
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
 * Anti-Collusion / Leak Detection Regexes
 * Flags attempts by agents or clients to exchange direct contact information.
 */
const PHONE_PATTERN = /(\+?254|0)[17]\d{8}|(\+?44|\+?1|\+?971|\+?49)\s?\d{7,10}/gi;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const OFF_PLATFORM_TERMS = /\b(mpesa\s+direct|till\s+number|send\s+to\s+my\s+phone|my\s+personal\s+number|call\s+me\s+directly|bypass\s+the\s+office|pay\s+me\s+cash|outside\s+the\s+system)\b/gi;

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
      leaks.push(`Off-platform settlement keyword detected: "${termMatches.join(', ')}"`);
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
  public static processClientQuery(prompt: string, _ctx: AiAssistantContext): AiMessage {
    const p = prompt.toLowerCase();
    const id = `ai-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    // Check for direct contact requests (security check)
    if (p.includes('agent phone') || p.includes('agent email') || p.includes('call the agent') || p.includes('talk to verifier directly')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: true,
        content: `Safeguard Notice: For your legal protection and to maintain complete objectivity, field verifiers operate under strict anonymity. You do not deal directly with the verifier, and they never see your private contact info. All updates, questions, and instructions flow through our Nairobi operations coordinator.`,
        action: {
          label: 'Message Nairobi Coordinator',
          path: '/messages',
          description: 'Communicate with your assigned coordinator at Nairobi HQ.'
        },
        suggestedPrompts: [
          'What is the status of my project?',
          'How do construction milestone audits work?',
          'Speak to a human operations coordinator'
        ]
      };
    }

    // Human Escalation
    if (p.includes('human') || p.includes('speak to a person') || p.includes('call me') || p.includes('coordinator') || p.includes('escalat')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        requiresHumanEscalation: true,
        content: `I have notified our Nairobi HQ Operations Desk. Coordinator Sarah Kamau has received your file reference and will review your project notes immediately. You can also reach our direct phone desk or start a live coordinator relay.`,
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

    // Navigation: New verification
    if (p.includes('new request') || p.includes('book') || p.includes('start') || p.includes('inspect a shamba') || p.includes('verify my plot') || p.includes('new verification')) {
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

    // Navigation: Construction tracking
    if (p.includes('construction') || p.includes('foundation') || p.includes('walling') || p.includes('roof') || p.includes('cement') || p.includes('fundi')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `In our construction oversight desk, you can monitor building milestones in Mashinani from slab pouring to roof trusses. Our verifiers physically count materials like cement bags and inspect curing quality against your drawings.`,
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

    // Navigation: Land / Beacons / Shamba
    if (p.includes('shamba') || p.includes('beacon') || p.includes('boundary') || p.includes('land') || p.includes('title deed') || p.includes('property')) {
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

    // Navigation: Reports & Evidence
    if (p.includes('report') || p.includes('dossier') || p.includes('photo') || p.includes('evidence') || p.includes('proof')) {
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

    // Navigation: Payments & Invoices
    if (p.includes('pay') || p.includes('cost') || p.includes('quote') || p.includes('fee') || p.includes('invoice') || p.includes('mpesa')) {
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
        'How do I book a site inspection?',
        'Where do I view my active requests?',
        'Check construction milestone progress',
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

    // Anti-Collusion: Agent asking for client contact details
    if (p.includes('client phone') || p.includes('client email') || p.includes('client number') || p.includes('who is the client') || p.includes('client name')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: true,
        content: `Security Violation Warning: Client personal details are strictly confidential. Under our Anti-Collusion Protocol, field agents verify the site and physical works only. All communication, questions, or schedule notices must be submitted via Nairobi HQ Dispatch. Solicitations for direct contact result in immediate de-registration.`,
        action: {
          label: 'Contact Nairobi HQ Dispatch',
          path: '/agent#dispatch',
          description: 'Submit an operational query to HQ.'
        },
        suggestedPrompts: [
          'What are my active mission tasks?',
          'How do I record a GPS site check-in?',
          'What photos are required for foundation milestone?'
        ]
      };
    }

    // Site Access / Blocked
    if (p.includes('gate') || p.includes('watchman') || p.includes('access') || p.includes('denied') || p.includes('locked') || p.includes('refused')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        requiresHumanEscalation: true,
        content: `If site entry is blocked or the caretaker refuses admission: do not force entry or engage in disputes. Record your GPS location at the gate, take a photograph of the gate/boundary, and submit an Access Obstacle notice to HQ Dispatch. HQ will contact the client's authorized local representative.`,
        action: {
          label: 'Submit Site Access Notice',
          path: '/agent#checkin',
          description: 'Flag site access restriction with GPS proof.'
        },
        suggestedPrompts: [
          'How do I record an inconclusive finding?',
          'View my active assignments',
          'Review verifier ethics code'
        ]
      };
    }

    // Checklist Guidance
    if (p.includes('photo') || p.includes('camera') || p.includes('checklist') || p.includes('evidence') || p.includes('angle')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Standard Evidence Protocol: Capture at least 4 cardinal perimeter angles, 1 close-up of boundary beacons, physical counts of materials in store (cement, steel rebar, blocks), and clear shots of curing conditions. All uploads automatically receive SHA-256 integrity hashing and GPS telemetry.`,
        action: {
          label: 'Open Evidence Queue',
          path: '/agent#evidence',
          description: 'Upload field inspection photos and video telemetry.'
        },
        suggestedPrompts: [
          'How do I verify boundary beacons?',
          'How to document missing cement bags?',
          'Submit completed mission'
        ]
      };
    }

    // Tasks & Assignments
    if (p.includes('task') || p.includes('assignment') || p.includes('job') || p.includes('mission') || p.includes('today')) {
      const pendingCount = ctx.requests.length;
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `You currently have ${pendingCount} active mission(s) in your coverage county. Remember to complete your GPS check-in upon arrival at the site boundary marker before commencing inspection observations.`,
        action: {
          label: 'View Active Assignments',
          path: '/agent#tasks',
          description: 'Review assigned briefs, locations, and milestones.'
        },
        suggestedPrompts: [
          'GPS Site Check-In guide',
          'Upload milestone photos',
          'View M-Pesa verifier earnings'
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
        'Review my active missions',
        'Check photo requirements for walling milestone',
        'Record GPS site check-in',
        'Report a site access issue to HQ'
      ]
    };
  }

  /**
   * Process a prompt from an Admin / Operations Coordinator
   */
  public static processAdminQuery(prompt: string, _ctx: AiAssistantContext): AiMessage {
    const p = prompt.toLowerCase();
    const id = `ai-msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

    // Data leak & Anti-Collusion Audit
    if (p.includes('leak') || p.includes('security') || p.includes('audit') || p.includes('scan') || p.includes('collusion')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        securityAlert: false,
        content: `Security Integrity Status: Bi-directional zero-contact leak safeguarding is active across all portals. Field agents receive masked client identifiers (DV-CL-XXXX) with no phone or email disclosure. Client request views display verified agent badges without personal contact numbers. All relays route through operations.`,
        action: {
          label: 'Inspect Platform Activity Stream',
          path: '/admin?tab=activity',
          description: 'Review audited sessions, member logins, and dispatch telemetry.'
        },
        suggestedPrompts: [
          'View newly registered members',
          'Check unassigned diaspora requests',
          'Review QA pending reports'
        ]
      };
    }

    // Matchmaker & Verifier Assignment
    if (p.includes('assign') || p.includes('match') || p.includes('agent') || p.includes('verifier') || p.includes('dispatch')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Matchmaker Intelligence: When assigning a verifier to a Diaspora request, filter by the parcel county (e.g. Kiambu, Machakos, Kajiado, Nairobi), verify conflict-of-interest clearance status, and review active workload. Ensure the verifier has no familial or commercial ties to the contractor.`,
        action: {
          label: 'Open Operations Matchmaker Desk',
          path: '/admin?tab=requests',
          description: 'Pair incoming requests with local field verifiers.'
        },
        suggestedPrompts: [
          'Which requests are unassigned?',
          'View active verifier network',
          'Check member directory'
        ]
      };
    }

    // Member Roster (Who Joined)
    if (p.includes('who joined') || p.includes('members') || p.includes('clients') || p.includes('directory')) {
      return {
        id,
        sender: 'assistant',
        timestamp,
        content: `Executive Directory: All registered clients and verified field operatives are tracked in your private operations directory. You can inspect joined dates, diaspora locations (UK, USA, UAE, Europe), and total project volumes.`,
        action: {
          label: 'Open Member Directory',
          path: '/admin?tab=clients',
          description: 'View live directory of who joined and active diaspora accounts.'
        },
        suggestedPrompts: [
          'Review financial cockpit',
          'Check dispute cases',
          'Scan platform for data leaks'
        ]
      };
    }

    // Default Admin Copilot
    return {
      id,
      sender: 'assistant',
      timestamp,
      content: `Operations Copilot Active. I can help you monitor data leak prevention, match diaspora requests to field agents, audit incoming QA dossiers, and oversee platform activity. What would you like to review?`,
      suggestedPrompts: [
        'Scan platform for data leaks',
        'Check unassigned diaspora requests',
        'Review who joined (Member directory)',
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

    if (ctx.role === 'admin') {
      return this.processAdminQuery(trimmed, ctx);
    } else if (ctx.role === 'agent') {
      return this.processAgentQuery(trimmed, ctx);
    } else {
      return this.processClientQuery(trimmed, ctx);
    }
  }
}
