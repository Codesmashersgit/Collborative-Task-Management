import useSWR from 'swr';
import { useEffect } from 'react';
import { taskApi } from '../lib/api';
import { onTaskUpdate, onTaskDelete } from '../lib/socket';
import type { Task, Priority, Status } from '../types';

interface UseTasksOptions {
  status?: Status;
  priority?: Priority;
  assignedToId?: string;
  creatorId?: string;
}

export const useTasks = (options?: UseTasksOptions) => {
  const { data, error, mutate, isLoading } = useSWR<Task[], Error>(
    ['tasks', options],
    async () => {
      const response = await taskApi.getAll(options);
      return response.data || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeUpdate = onTaskUpdate((updatedTask: Task) => {
      mutate((currentTasks = []) => {
        const index = currentTasks.findIndex((t) => t.id === updatedTask.id);
        if (index === -1) return [...currentTasks, updatedTask]; // new task
        const newTasks = [...currentTasks];
        newTasks[index] = updatedTask;
        return newTasks;
      }, false);
    });

    const unsubscribeDelete = onTaskDelete(({ id }: { id: string }) => {
      mutate((currentTasks = []) => currentTasks.filter((t) => t.id !== id), false);
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeDelete();
    };
  }, [mutate]);

  return {
    tasks: data,
    isLoading,
    error,
    mutate,
  };
};
