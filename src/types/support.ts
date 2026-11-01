import type { LatLng } from './common';

/**
 * A report or feedback a signed-in user sends from the app or the site. The server files it as
 * an issue in the private support repository on GitHub, labelled by kind and platform.
 */
export type SupportKind = 'bug' | 'route' | 'data' | 'suggestion';

export const SUPPORT_KINDS: SupportKind[] = ['bug', 'route', 'data', 'suggestion'];

export type SupportPlatform = 'web' | 'android';

export interface SupportReportRequest {
  kind: SupportKind;
  /** What the user wrote. Required, at most 4000 characters. */
  message: string;
  platform: SupportPlatform;
  appVersion: string;
  /** Device or browser, free text from the client (model and OS version, or user agent). */
  device?: string;
  /** The route the report is about (route review, a drive, the end of a drive). */
  routeId?: string;
  /** The zone the report is about (from a zone's card). */
  zoneId?: number;
  /** A point the report is about (a mark dropped while driving, or a tap on the map). */
  location?: LatLng;
  /** True when the user asks for an answer by email; only then is the address included. */
  replyByEmail?: boolean;
}

export interface SupportReportResponse {
  id: string;
  /**
   * The issue number, which the user can quote if they write again. Null when the report was
   * kept but no issue was filed (GitHub not configured or unreachable).
   */
  reference: number | null;
  /** True when the report was added to an open issue about the same zone. */
  merged: boolean;
}
