import useSWR from 'swr';
import { taskApi } from '../lib/api';

export const useTask = (id: string | null) => {
  const { data, error, mutate, isLoading } = useSWR(
    id ? ['task', id] : null,
    async () => {
      if (!id) return null;
      const response = await taskApi.getById(id);
      return response.data;
    }
  );

  return {
    task: data,
    isLoading,
    error,
    mutate,
  };
};

