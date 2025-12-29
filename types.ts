
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  photoFileName?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName?: string; // Optional for global view
  sessionType: string;
  date: string; // YYYY-MM-DD (useful for local filtering)
  startTime: string; // ISO string or HH:mm depending on implementation, prompt says startTime
  endTime: string;
  duration: number; // 1 or 2
  timezone: string;
  price: number;
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  start: string; // HH:mm
  end: string; // HH:mm
}

export enum AuthView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}

export enum ActiveView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY'
}

export interface TimezoneOption {
  value: string;
  label: string;
}
