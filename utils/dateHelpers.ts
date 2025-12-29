
import { AvailabilitySlot } from '../types';

export const getLocalTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (hours: number, minutes: number): string => {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const parseTime = (timeStr: string): { hours: number; minutes: number } => {
  const [h, m] = timeStr.split(':').map(Number);
  return { hours: h, minutes: m };
};

/**
 * Converts a slot time from IST (Asia/Kolkata) to target timezone.
 * Returns formatted Time and full Date string in target TZ.
 */
export const getLocalizedSlot = (timeStr: string, dateStr: string, targetTz: string): { time: string; dateLabel: string } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create a formatter for IST to extract UTC parts correctly
  const istDateStr = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  
  // We need to interpret the input as being in Asia/Kolkata
  // One way is using Date.toLocaleString and extracting pieces or using a fixed offset
  // Asia/Kolkata is UTC+5:30
  const date = new Date(istDateStr + '+05:30');

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: targetTz
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: targetTz
  });

  return {
    time: timeFormatter.format(date),
    dateLabel: dateFormatter.format(date).toUpperCase()
  };
};

export const getDayName = (dayIndex: number): string => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
};

export const getShortDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getAvailableDates = (daysCount: number = 30): Date[] => {
  const dates: Date[] = [];
  const start = new Date();
  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
};
