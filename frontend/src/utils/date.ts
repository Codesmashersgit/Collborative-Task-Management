import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param date ISO date string
 * @returns Formatted date (e.g., "Dec 31, 2024")
 */
export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy');
};

/**
 * Format date to datetime string for input
 * @param date ISO date string
 * @returns Datetime string (e.g., "2024-12-31T10:00")
 */
export const formatDateTime = (date: string): string => {
  return format(parseISO(date), "yyyy-MM-dd'T'HH:mm");
};

/**
 * Format relative time
 * @param date ISO date string
 * @returns Relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string): string => {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
};

/**
 * Check if date is overdue
 * @param date ISO date string
 * @returns True if date is in the past
 */
export const isOverdue = (date: string): boolean => {
  return isPast(parseISO(date));
};