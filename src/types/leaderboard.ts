export type TeamStatus = 'ACTIVE' | 'CALCULATING...' | 'COOLDOWN' | 'OFFLINE' | 'DISQUALIFIED';

export type MetricType = 
  | 'lidar' 
  | 'pointcloud' 
  | 'neural' 
  | 'trajectory' 
  | 'grid' 
  | 'optimization' 
  | 'slam'
  | 'custom';

export interface Team {
  id: string;
  rank: number;
  previousRank: number;
  teamName: string;
  institution: string;
  institutionCode?: string;
  logo?: string;
  logoUrl?: string;
  score: number;
  previousScore?: number;
  metricLabel?: string;
  metricValue?: string;
  metricType?: MetricType;
  round?: string;
  rankChange: number; // positive = rank improved (e.g. 5 -> 3 is +2), negative = rank dropped
  status: TeamStatus;
  lastUpdated?: string;
  details?: {
    accuracy?: number;
    latencyMs?: number;
    sensorHealth?: string;
    algorithm?: string;
  };
}

export type ConnectionState = 'LIVE' | 'SYNCING' | 'DELAYED' | 'OFFLINE' | 'STALE';

export interface LeaderboardState {
  teams: Team[];
  previousTeams: Team[];
  lastSyncTimestamp: number | null;
  connectionState: ConnectionState;
  syncError: string | null;
  dataSource: 'google-sheets' | 'mock' | 'simulator';
  sheetConfig: GoogleSheetConfig;
  activeRound: string;
  competitionTitle: string;
  isSoundEnabled: boolean;
}

export interface GoogleSheetConfig {
  sheetId: string;
  sheetName: string;
  apiKey?: string;
  pollIntervalMs: number;
  isPublishedCsv?: boolean;
}

export interface RankChangeEvent {
  teamId: string;
  teamName: string;
  oldRank: number;
  newRank: number;
  delta: number;
  oldScore: number;
  newScore: number;
  timestamp: number;
}
