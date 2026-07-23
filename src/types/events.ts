import type { LatLng } from './common';

/**
 * On-route events: forbidden zones, live traffic, and community reports. Served by the API
 * per route so every client shows the same feed.
 */
export type RouteEventType =
  | 'zone'
  | 'traffic'
  | 'police'
  | 'accident'
  | 'hazard'
  | 'closure';

export type TrafficLevel = 'free' | 'moderate' | 'heavy';

export interface RouteEvent {
  id: string;
  type: RouteEventType;
  location: LatLng;
  /** Distance from the route origin, measured along the route. Drives approach detection. */
  routeDistanceMeters: number;
  /** Zone layer name or a short free label. */
  label?: string;
  labelHe?: string;
  /** True when a driver raised this report rather than it being seeded. */
  reportedByUser?: boolean;
  createdAt?: string;
}

export interface TrafficSegment {
  /** Geometry vertex indices the segment spans. */
  fromIndex: number;
  toIndex: number;
  level: TrafficLevel;
}

export interface RouteEventBundle {
  routeId: string;
  events: RouteEvent[];
  traffic: TrafficSegment[];
  /** Extra seconds the congestion adds to the trip. */
  delaySeconds: number;
}

/** Report types a driver can raise, in the order the picker shows them. */
export const REPORT_TYPES: RouteEventType[] = [
  'police',
  'accident',
  'hazard',
  'closure',
  'traffic',
];

export interface CreateReportRequest {
  routeId: string;
  type: RouteEventType;
  location: LatLng;
}
