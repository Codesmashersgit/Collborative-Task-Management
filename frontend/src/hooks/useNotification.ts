import useSWR from 'swr';
import { useEffect } from 'react';
import { notificationApi } from '../lib/api';
import { onNotification } from '../lib/socket';
import type { Notification } from '../types';

export const useNotifications = () => {
  const { data, error, mutate, isLoading } = useSWR<Notification[], Error>(
    'notifications',
    async () => {
      const response = await notificationApi.getAll();
      return response.data || [];
    },
    {
      revalidateOnFocus: false,
    }
  );

  // Subscribe to real-time notifications
  useEffect(() => {
    // onNotification should return a cleanup function
    const unsubscribe = onNotification((notification: Notification) => {
      mutate((current = []) => [notification, ...current], false);
    });

    // ensure cleanup function
    return () => {
      unsubscribe?.();
    };
  }, [mutate]);

  const markAsRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    mutate((current = []) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
      false
    );
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllAsRead();
    mutate((current = []) => current.map((n) => ({ ...n, read: true })), false);
  };

  const unreadCount = data?.filter((n) => !n.read).length || 0;

  return {
    notifications: data,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    mutate,
  };
};
