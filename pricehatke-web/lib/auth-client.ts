'use client';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  provider: string;
  referralCode: string;
}

export function setAuthTokens(accessToken: string, refreshToken: string, user?: UserSession) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (user) {
      localStorage.setItem('userSession', JSON.stringify(user));
    }
  }
}

export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userSession');
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function getUserSession(): UserSession | null {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}
