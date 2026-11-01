import type { Language } from './common';

/**
 * A spoken instruction is assembled from short clips, never stored as a whole sentence.
 * Clip keys are stable and independent of their text, so a recording can be replaced
 * without breaking anything that references it.
 *
 * Key shape: "<role>.<value>", e.g. "prefix.in", "dist.200m", "action.turn_right".
 */
export type VoiceClipRole = 'prefix' | 'dist' | 'action' | 'zone' | 'street' | 'misc';

export type VoiceClipSource = 'recorded' | 'generated';

export interface VoiceClip {
  key: string;
  role: VoiceClipRole;
  /** Text the clip speaks, for QA and for the text fallback. */
  text: string;
  url: string;
  durationMs: number;
  source: VoiceClipSource;
  /** Content hash, so a client re-downloads only what changed. */
  hash: string;
}

export interface VoicePackManifest {
  language: Language;
  voiceId: string;
  version: number;
  clips: VoiceClip[];
  updatedAt: string;
}

/**
 * The selectable voices. The voice id picks the speaker (a male or a female voice); the wording
 * is the same in both Hebrew packs and addresses the driver in the masculine. `he-default` is
 * kept as an alias of `he-male` for preferences saved before the choice existed.
 */
export const VOICE_IDS = ['he-male', 'he-female', 'en-default'] as const;
export type VoiceId = (typeof VOICE_IDS)[number] | 'he-default';

/**
 * Clip keys added for the alert and status announcements. Listed so both clients reference
 * the same strings:
 * - `alert.speed_camera`, `alert.rail_crossing`, `alert.speeding`
 * - `misc.gps_lost`, `misc.gps_recovered`, `misc.back_on_route`, `misc.return_to_route`
 * - `exit.1` .. `exit.8` - the roundabout exit ordinal ("ביציאה השלישית"), spoken after
 *   `action.roundabout_enter`
 */
export const ROUNDABOUT_EXIT_KEYS_MAX = 8;

/** Announced distances are a closed ladder, so the clip library stays small. */
export const DISTANCE_LADDER_METERS = [
  2000, 1000, 800, 500, 300, 200, 100, 50, 0,
] as const;

export interface VoiceResolveRequest {
  language: Language;
  voiceId: string;
  /** Clip keys the client does not have yet. */
  keys: string[];
}

export interface VoiceResolveResponse {
  clips: VoiceClip[];
  /** Keys that could not be produced. The client speaks a shorter instruction instead. */
  missing: string[];
}
