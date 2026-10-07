export interface HeroTeam {
  id: string;
  name: string;
  institution: string;
  score: number;
  /** Rank movement since the last round: +2 climbed, -1 dropped, 0 unchanged. */
  rankDelta?: number;
  /** Optional logo URL. Falls back to initials. */
  logoUrl?: string;
  /** Footer line used by the 2D fallback, e.g. "LiDAR accuracy: 98.4%". */
  metric?: string;
}

export type VisualQuality = 'auto' | 'high' | 'medium' | 'low';
export type Tier = 'high' | 'medium' | 'low';
export type Rank = 1 | 2 | 3;

export interface LeaderEvent {
  type: 'NEW_LEADER';
  teamId: string;
  previousLeaderId: string;
}

export interface HeroEnvironment {
  webgl: boolean;
  reducedMotion: boolean;
  mobile: boolean;
  lowEnd: boolean;
}
