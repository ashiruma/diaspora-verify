import type { NotificationItem, ActiveRole } from '../types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    targetRole: 'client',
    title: 'Stop-Payment Advisory Active',
    message: 'Nairobi Operations flagged a KES 300,000 discrepancy on Milestone 3 for Kitengela Bungalow. Contractor requested KES 450,000 but formwork is only 40% complete.',
    type: 'alert',
    read: false,
    timestamp: '10 mins ago',
    requestId: 'DV-2026-KJD-0104',
    link: '/request/DV-2026-KJD-0104'
  },
  {
    id: 'notif-002',
    targetRole: 'field_agent',
    title: 'New Mission Assigned: Kitengela Plot 42/B',
    message: 'You have been assigned to verify Milestone 3 lintel casting in Kajiado County. Scheduled visit: 2026-10-14.',
    type: 'info',
    read: true,
    timestamp: '2 hours ago',
    requestId: 'DV-2026-KJD-0104',
    link: '/request/DV-2026-KJD-0104'
  },
  {
    id: 'notif-003',
    targetRole: 'operations',
    title: 'New High-Priority Intake: Westlands Business',
    message: 'Corporate client submitted intake for commercial premises due diligence in Nairobi (Westlands). Service fee paid via M-Pesa.',
    type: 'success',
    read: false,
    timestamp: '4 hours ago',
    requestId: 'DV-2026-NBI-0341',
    link: '/request/DV-2026-NBI-0341'
  },
  {
    id: 'notif-004',
    targetRole: 'corporate',
    title: 'Monthly Property Audit Ready',
    message: 'Tigoni Tea Ridge 1-Acre inspection completed. 8 high-resolution photos and crop vitality survey ready for review.',
    type: 'success',
    read: true,
    timestamp: '1 day ago',
    link: '/properties'
  }
];

export function createNotification(
  targetRole: ActiveRole | 'all',
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'alert' = 'info',
  requestId?: string,
  link?: string
): NotificationItem {
  return {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    targetRole,
    title,
    message,
    type,
    read: false,
    timestamp: 'Just now',
    requestId,
    link
  };
}
