import type { Priority, Status } from '../types';

/**
 * Get color classes for priority badge
 */
export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    Low: 'bg-blue-100 text-blue-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Urgent: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

/**
 * Get color classes for status badge
 */
export const getStatusColor = (status: Status): string => {
  const colors = {
    ToDo: 'bg-gray-100 text-gray-800',
    InProgress: 'bg-blue-100 text-blue-800',
    Review: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
  };
  return colors[status];
};

/**
 * Get readable status label
 */
export const getStatusLabel = (status: Status): string => {
  const labels = {
    ToDo: 'To Do',
    InProgress: 'In Progress',
    Review: 'Review',
    Completed: 'Completed',
  };
  return labels[status];
};

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format error message from API
 */
export const formatErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors.map((e: any) => e.message).join(', ');
  }
  return 'An error occurred. Please try again.';
};

/**
 * Combine class names conditionally
 */
export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};