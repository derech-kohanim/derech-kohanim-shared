import type { Language, Stringency, ThemePreference } from './common';

export type UserTier = 'guest' | 'registered' | 'verified';

/** How the account was created. Phone is reserved for a later milestone. */
export type AuthProvider = 'password' | 'google' | 'phone';

export interface UserPreferences {
  language: Language;
  theme: ThemePreference;
  stringency: Stringency;
  trafficAware: boolean;
  /** Avoid toll roads by default. Synced across the user's devices. */
  avoidTolls: boolean;
  /** Avoid danger zones (Area A) by default. On unless the user turns it off. */
  avoidDangerZones: boolean;
  voiceEnabled: boolean;
  /** Voice pack identifier, e.g. "he-default". */
  voiceId: string;
  units: 'metric';
}

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  /** Profile photo, e.g. the Google account picture. Null until a provider supplies one. */
  avatarUrl?: string | null;
  tier: UserTier;
  providers: AuthProvider[];
  preferences: UserPreferences;
  /** Version of the terms the user accepted, null until accepted. */
  acceptedTermsVersion: string | null;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
  /** Must match the current terms version or registration is rejected. */
  acceptedTermsVersion: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Google Identity Services credential, exchanged server side. */
export interface GoogleAuthRequest {
  idToken: string;
  acceptedTermsVersion?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface TermsDocument {
  version: string;
  language: Language;
  title: string;
  /** Markdown. */
  body: string;
  updatedAt: string;
}
