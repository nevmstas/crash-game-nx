import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/trpc';
import { clearToken, setToken } from './token';

const refreshToken = async () => {
  const res = await fetch(`${process.env.VUE_APP_BACKEND_API}/auth.refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });

  const data = await res.json();
  if (data?.result?.data?.token) {
    setToken(data.result.data.token);
    return data.result.data.token;
  }
  clearToken();
  return null;
};

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3333/trpc',
      headers() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      async fetch(url, options) {
        let response = await fetch(url, options);

        if (response.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            const retryHeaders = new Headers(options?.headers || {});
            retryHeaders.set('Authorization', `Bearer ${newToken}`);
            response = await fetch(url, { ...options, headers: retryHeaders });
          }
        }
        return response;
      },
    }),
  ],
});
