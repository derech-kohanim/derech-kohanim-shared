import type {
  GeoJsonLineString,
  GeoJsonPolygon,
  Language,
  LatLng,
  Stringency,
  TravelMode,
} from './common';

export type RoutingEngine = 'here' | 'google' | 'graphhopper' | 'hybrid' | 'mock';

export interface ZoneProperties {
  id: number;
  /** Short Hebrew title of the reason, e.g. "תחת הכביש נמצאו קברים". */
  name: string;
  nameHe: string;
  stringency: Stringency;
  /** Locality, e.g. "טבריה". */
  city: string | null;
  /** Street, when the reason is street-specific. */
  street: string | null;
  /** The full halachic explanation shown to the user. */
  description: string | null;
}

export interface ZoneFeature {
  type: 'Feature';
  properties: ZoneProperties;
  geometry: GeoJsonPolygon;
}

export interface ZoneCollection {
  type: 'FeatureCollection';
  features: ZoneFeature[];
  /** Layer version, so a client can skip downloading unchanged data. */
  version: number;
}

/**
 * Danger zones (Oslo "Area A" etc.) - a SEPARATE axis from halachic stringency. Avoided via
 * `avoidDangerZones`, on by default, independent of the stringency layers.
 */
export interface DangerZoneProperties {
  id: number;
  name: string;
  city: string | null;
  description: string | null;
}

export interface DangerZoneFeature {
  type: 'Feature';
  properties: DangerZoneProperties;
  geometry: GeoJsonPolygon;
}

export interface DangerZoneCollection {
  type: 'FeatureCollection';
  features: DangerZoneFeature[];
  version: number;
}

/** Synthetic manoeuvres the server injects around forbidden zones. */
export type ZoneManeuverType =
  | 'zone_enter'
  | 'zone_exit'
  | 'zone_origin'
  | 'zone_destination';

export interface ManeuverZone {
  name: string;
  nameHe: string;
  stringency: Stringency;
  /** The reason/explanation for this zone, surfaced in the alert. */
  description: string | null;
  city: string | null;
  /** True when this is a danger zone (Area A) rather than a halachic stringency zone. */
  danger?: boolean;
}

/**
 * One step. `voiceKeys` is the ordered list of audio clip ids needed to speak it, so the
 * client can preload exactly what this route requires before departure.
 */
export interface Maneuver {
  id: string;
  /** Provider prose, already localised. Display text, never used for voice assembly. */
  instruction: string;
  /** Stable action key, e.g. "turn_right". Drives the icon and the voice clip. */
  action: string;
  point: LatLng;
  /** Distance from the previous manoeuvre. */
  distanceMeters: number;
  /** Index into the route geometry where this step begins. */
  geometryIndex: number;
  street: string | null;
  zone?: ManeuverZone;
  voiceKeys: string[];
}

export interface RouteRequest {
  origin: LatLng;
  destination: LatLng;
  stringency: Stringency;
  mode: TravelMode;
  trafficAware: boolean;
  language: Language;
  engine?: RoutingEngine;
  /** Avoid toll roads. Passed through to the provider (avoidTolls). */
  avoidTolls?: boolean;
  /** Also avoid danger zones (Area A). Defaults to true on the server when omitted. */
  avoidDangerZones?: boolean;
  /**
   * Also return the plain provider route WITHOUT zone avoidance, for comparison. The server
   * only fills `RoutePlan.unavoidedRoute` when avoidance actually changed the route.
   */
  includeUnavoided?: boolean;
}

/**
 * Result of a compute: the chosen route plus up to two alternatives, each independently
 * verified against the active zones. `POST /api/routes/compute` returns this.
 */
export interface RoutePlan {
  /** 1..3 zone-verified routes, best first. Empty only when nothing could be produced. */
  routes: RouteResult[];
  /**
   * The plain provider route with NO zone avoidance, present only when the user asked for it
   * (`includeUnavoided`) AND avoidance actually changed the outcome (the naive route crosses
   * a zone). Always `verifiedClean: false` - shown for comparison, never navigable.
   */
  unavoidedRoute?: RouteResult;
}

export interface RouteResult {
  id: string;
  geometry: GeoJsonLineString;
  maneuvers: Maneuver[];
  distanceMeters: number;
  durationSeconds: number;
  /** True only when the server proved the geometry touches no active zone. */
  verifiedClean: boolean;
  /** Stable code when not clean, e.g. "avoidance_failed". */
  reason?: string;
  attribution: string;
  engine: RoutingEngine;
  /** True when this route avoids toll roads. */
  avoidsTolls?: boolean;
  /** Short label for an alternative, e.g. "fastest" | "shortest" | "alt". */
  label?: string;
  /** Returned distance divided by the direct route. 1 means avoidance cost nothing. */
  detourRatio?: number;
  /** Every audio clip this route will need, deduplicated. */
  requiredVoiceKeys: string[];
  debug?: {
    naiveGeometry?: GeoJsonLineString;
    attempts?: string[];
    naiveDistanceMeters?: number;
  };
}

export interface ProviderInfo {
  name: RoutingEngine;
  available: boolean;
  isDefault: boolean;
  attribution: string;
  supportsNativeAvoidance: boolean;
  supportsLiveTraffic: boolean;
}

/** Live navigation. Also drives simulation, which replays the same state machine. */
export type NavigationStatus =
  | 'idle'
  | 'navigating'
  | 'rerouting'
  | 'arrived'
  | 'cancelled';

export interface NavigationSession {
  id: string;
  routeId: string;
  status: NavigationStatus;
  /** True when positions come from the simulator rather than the device. */
  simulated: boolean;
  startedAt: string;
}

/** Client to server progress report. The server decides whether a reroute is needed. */
export interface NavigationProgressRequest {
  sessionId: string;
  location: LatLng;
  headingDegrees: number | null;
  speedMps: number | null;
  timestamp: string;
}

export interface NavigationProgressResponse {
  status: NavigationStatus;
  /** Index of the manoeuvre the driver is heading towards. */
  currentManeuverIndex: number;
  distanceToManeuverMeters: number;
  distanceRemainingMeters: number;
  durationRemainingSeconds: number;
  /** Set when the driver left the route and a new one was computed. */
  route?: RouteResult;
  /** Set when the current position is inside or approaching a zone. */
  zoneAlert?: {
    type: ZoneManeuverType | 'zone_ahead';
    zone: ManeuverZone;
    distanceMeters: number;
  };
}
