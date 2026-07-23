import type { LatLng, Language } from './common';

/**
 * What the destination field understands. The client does not decide - it sends the raw
 * text and the server classifies, so every platform behaves identically.
 */
export type PlaceQueryKind =
  /** Free text: street, city, business name. */
  | 'text'
  /** Parsed directly from the input, e.g. "32.0873, 34.8288". No upstream call needed. */
  | 'coordinates'
  /** Resolved from the user's saved places. */
  | 'saved'
  /** Resolved from a previous search. */
  | 'recent';

export type PlaceCategory =
  | 'address'
  | 'city'
  | 'poi'
  | 'synagogue'
  | 'coordinates'
  | 'home'
  | 'work'
  | 'other';

/**
 * One row in the suggestion list.
 *
 * `title` is what the user reads first and must stand alone; `subtitle` is the disambiguating
 * context. Splitting them is what keeps the list scannable at a glance.
 */
export interface PlaceSuggestion {
  id: string;
  title: string;
  subtitle: string | null;
  category: PlaceCategory;
  kind: PlaceQueryKind;
  /** Present when the location is already known. Absent means a details lookup is needed. */
  location: LatLng | null;
  /** Stable upstream identifier, when the provider supplies one. */
  externalId: string | null;
  /** Metres from the search origin, when one was supplied. */
  distanceMeters: number | null;
  /** Character ranges in `title` that matched the query, for highlighting. */
  matchedRanges: { start: number; length: number }[];
}

export interface PlaceSearchRequest {
  query: string;
  language: Language;
  /** Biases and sorts results. Usually the current location. */
  near?: LatLng;
  /** Client-generated, kept stable while the user types one destination. */
  sessionToken?: string;
  limit?: number;
}

export interface PlaceSearchResponse {
  query: string;
  suggestions: PlaceSuggestion[];
  /** True when no upstream call was made. */
  cached: boolean;
}

/** Resolves a suggestion that arrived without coordinates. */
export interface PlaceDetailsRequest {
  id: string;
  language: Language;
  sessionToken?: string;
}

export interface SavedPlace {
  id: string;
  label: string;
  category: PlaceCategory;
  location: LatLng;
  address: string | null;
  createdAt: string;
}

export interface RecentPlace {
  id: string;
  title: string;
  subtitle: string | null;
  location: LatLng;
  lastUsedAt: string;
  useCount: number;
}
