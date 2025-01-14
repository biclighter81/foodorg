import { createContext, useContext } from 'react';

export const AuthContext = createContext<{
  auth: any;
  userinfo: any;
  setAuth: Function;
  setUserInfo: Function;
}>({
  auth: null,
  userinfo: null,
  setAuth: () => {},
  setUserInfo: () => {},
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
