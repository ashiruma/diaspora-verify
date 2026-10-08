import type { AuthenticatedUser } from './authorization';

export const DEMO_USERS: Record<'client' | 'agent' | 'admin', AuthenticatedUser> = {
  client: {
    id: 'usr-client-01',
    email: 'jane.doe@diasporaverify.demo',
    name: 'Jane Doe',
    role: 'client',
    clientId: 'usr-client-01',
    phone: '+44 7700 900142',
    locationAbroad: 'London, United Kingdom',
    mfaEnabled: false,
  },
  agent: {
    id: 'agt-018',
    agentId: 'agt-018',
    email: 'brian.omondi@diasporaverify.co.ke',
    name: 'Brian Omondi DV-018',
    role: 'agent',
    phone: '+254 722 998 877',
    mfaEnabled: true,
  },
  admin: {
    id: 'usr-ops-01',
    email: 'sarah.kamau@diasporaverify.co.ke',
    name: 'Sarah Kamau',
    role: 'admin',
    subRole: 'super_admin',
    phone: '+254 722 000 111',
    mfaEnabled: true,
  },
};

export const ADDITIONAL_DEMO_USERS: Record<string, AuthenticatedUser> = {
  'david.mwangi.uk@gmail.com': {
    id: 'usr-client-david',
    email: 'david.mwangi.uk@gmail.com',
    name: 'David Mwangi',
    role: 'client',
    clientId: 'usr-client-david',
    phone: '+44 7700 900142',
    locationAbroad: 'London, United Kingdom',
    mfaEnabled: false,
  },
  'evans.kiptoo@diasporaverify.co.ke': {
    id: 'agt-01',
    email: 'evans.kiptoo@diasporaverify.co.ke',
    name: 'Eng. Evans Kiptoo',
    role: 'agent',
    agentId: 'agt-01',
    phone: '+254 722 419 802',
    mfaEnabled: true,
  },
  'amara.ops@diasporaverify.co.ke': {
    id: 'usr-ops-01',
    email: 'amara.ops@diasporaverify.co.ke',
    name: 'Amara Kiprotich',
    role: 'admin',
    subRole: 'super_admin',
    phone: '+254 722 000 111',
    mfaEnabled: true,
  },
};

export const AUTH_USER_KEY = 'diaspora_verify_auth_user_v2';
export const REGISTERED_USERS_KEY = 'diaspora_verify_registered_users_v2';
