let accessToken: string | null = localStorage.getItem('token');

export const getToken = () => accessToken;

export const setToken = (token: string) => {
  accessToken = token;
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  accessToken = null;
  localStorage.removeItem('token');
};
