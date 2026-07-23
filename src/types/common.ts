export type LatLng = { lat: number; lng: number };

export type Language = 'he' | 'en';

export type ThemePreference = 'system' | 'light' | 'dark';

/** Halachic stringency layers. Cumulative: machmirim includes taharat includes basic. */
export type Stringency = 'basic' | 'taharat' | 'machmirim';

export type TravelMode = 'drive' | 'walk';

export interface GeoJsonLineString {
  type: 'LineString';
  /** [lng, lat] pairs, per RFC 7946. */
  coordinates: [number, number][];
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

/** Errors carry a stable code so the client translates; `message` is for logs only. */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
