
import React from 'react';
import { AvailabilitySlot } from './types';

export const COLORS = {
  primary: '#fdfaff',
  primaryAccent: '#d8b4fe',
  primaryDark: '#a855f7',
  white: '#ffffff',
  grayBg: '#fafafa',
};

export const PRICING = {
  ONE_HOUR: 120,
  TWO_HOUR: 200,
};

/**
 * AVAILABILITY_SCHEDULE is defined in IST (Asia/Kolkata)
 */
export const AVAILABILITY_SCHEDULE: AvailabilitySlot[] = [
  // Monday: 11:00 AM – 1:00 PM
  { dayOfWeek: 1, start: '11:00', end: '13:00' },
  // Tuesday: 11:00 AM – 1:00 PM, 2:00 PM – 4:00 PM
  { dayOfWeek: 2, start: '11:00', end: '13:00' },
  { dayOfWeek: 2, start: '14:00', end: '16:00' },
  // Wednesday
  { dayOfWeek: 3, start: '11:00', end: '13:00' },
  { dayOfWeek: 3, start: '14:00', end: '16:00' },
  // Thursday
  { dayOfWeek: 4, start: '11:00', end: '13:00' },
  { dayOfWeek: 4, start: '14:00', end: '16:00' },
  // Friday
  { dayOfWeek: 5, start: '11:00', end: '13:00' },
  { dayOfWeek: 5, start: '14:00', end: '16:00' },
  // Saturday: 11:00 AM – 1:00 PM
  { dayOfWeek: 6, start: '11:00', end: '13:00' },
];

export const ICONS = {
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Logout: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
};
