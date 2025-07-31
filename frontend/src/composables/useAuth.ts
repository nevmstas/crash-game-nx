import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '../api/trpc';
import { LoginInput, RegisterInput } from '@crash-game-nx/shared-types';

export function useAuth() {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (data: LoginInput) => {
      return await trpc.auth.login.mutate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterInput) => {
      return await trpc.auth.register.mutate(data);
    },
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      await trpc.auth.logout.mutate();
    },
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
    },
  });

  const me = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await trpc.auth.me.query();
      } catch (err: any) {
        if (err.message.includes('Invalid token')) {
          await trpc.auth.refreshToken.mutate();
          return await trpc.auth.me.query();
        }
        throw err;
      }
    },
    retry: false,
  });

  return { login, me, register, logout: mutate };
}
