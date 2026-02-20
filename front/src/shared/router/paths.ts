import { Route } from 'next';

export const routes = {
  // use typeHandle as a key if corresponding typeHandle exists
  homepage: '/',
  login: '/login',
  registration: '/registration',
  password: '/password',
  dashboard: '/dashboard',
  recoverReset: '/password/reset',
  forgotPassword: '/forgot-password', 
  resetPassword: '/reset-password',
  //emailConfirm: (token) => `/email/confirm/${token}`,
} satisfies Record<string, Route>;
