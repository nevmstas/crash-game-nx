import { useMutation, useQuery } from '@tanstack/vue-query';
import { trpc } from '../api/trpc';
import { LoginInput, RegisterInput } from '@crash-game-nx/shared-types';

export function useAuth() {
  const login = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await trpc.auth.login.mutate(data);
      localStorage.setItem('token', res.token);
      return res;
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await trpc.auth.register.mutate(data);
      return res;
    },
  });

  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => trpc.auth.me.query(),
    enabled: !!localStorage.getItem('token'),
  });

  return { login, me, register };
}
