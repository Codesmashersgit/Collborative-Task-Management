import useSWR from 'swr';
import { userApi } from '../lib/api';

export const useUsers = () => {
  const { data, error, isLoading } = useSWR('users', async () => {
    const response = await userApi.getAll();
    return response.data || [];
  });

  return {
    users: data,
    isLoading,
    error,
  };
};