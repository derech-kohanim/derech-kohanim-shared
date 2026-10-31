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
 * What a lane's road markings allow, from the OSM `turn:lanes` vocabulary. `none` is a lane
 * with no marking (usually "through").
 */
export type LaneIndication =
  | 'left'
  | 'slight_left'
  | 'sharp_left'
  | 'through'
  | 'right'
  | 'slight_right'
  | 'sharp_right'
  | 'reverse'
  | 'merge_to_left'
  | 'merge_to_right'
  | 'none';

/** One lane at the approach to a manoeuvre. */
export interface Lane {
  indications: LaneIndication[];
  /** True when this lane can be used to perform the manoeuvre. */
  valid: boolean;
}

/**
 * A stretch of the route with one speed limit. Segments cover the geometry contiguously, in
 * order, by vertex index (inclusive `fromIndex`, exclusive `toIndex`, like a path detail).
 */
export interface SpeedLimitSegment {
  fromIndex: number;
  toIndex: number;
  /** Limit in km/h, or null when nothing is known for this stretch. */
  kmh: number | null;
  /**
   * Where the number comes from: a mapped sign, the country's legal default for the road
   * type, or the built-up-area default (50 km/h in Israel) when only the area is known.
   */
  source: 'sign' | 'estimated' | 'urban_default';
  /** True when the stretch lies in a built-up area. */
  urban?: boolean;
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
  /** Road reference number of the road this step continues on, e.g. "1" or "443". */
  roadRef?: string | null;
  /** Roundabout exit to take, 1-based. Only on roundabout manoeuvres. */
  exitNumber?: number;
  /**
   * Lanes at the approach to this manoeuvre, left to right in the driving direction. Absent
   * when the map has no lane data for that approach.
   */
  lanes?: Lane[];
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
  /**
   * Speed limits along the geometry. Absent when the engine that produced the shape has no
   * speed data (only the self-hosted GraphHopper provides it).
   */
  speedLimits?: SpeedLimitSegment[];
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

/** How a driver rates a trip when it ends. */
export type NavFeedbackRating = 'good' | 'bad';

/**
 * End-of-trip feedback. `text` is the optional free-text description a driver adds when the
 * rating is 'bad' (what went wrong); it is omitted on a 'good' rating.
 */
export interface NavFeedbackRequest {
  routeId: string;
  rating: NavFeedbackRating;
  text?: string;
}

export interface NavFeedback {
  id: string;
  routeId: string;
  rating: NavFeedbackRating;
  text: string | null;
  createdAt: string;
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
