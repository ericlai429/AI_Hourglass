export type DisplayMode = 'crystal' | 'hourglass';

export type ModelType = 'gemini' | 'claude' | 'gpt' | 'custom';

export interface ModelQuota {
  id: ModelType;
  name: string;
  badge: string;
  themeColor: string; // Hex or tailwind class
  glowColor: string;
  potionColor: {
    top: string;
    bottom: string;
    glow: string;
    particle: string;
  };
  sandColor: {
    primary: string;
    secondary: string;
    glow: string;
  };
  
  // Weekly Limit
  weeklyRemainingPct: number; // e.g. 89%
  weeklyRefreshSeconds: number; // e.g. 6 days 3 hours = 529200s
  weeklyTotalSeconds: number; // 7 days = 604800s
  
  // 5-Hour Limit
  fiveHourRemainingPct: number; // e.g. 75%
  fiveHourRefreshSeconds: number; // e.g. 1 hour 1 minute = 3660s
  fiveHourTotalSeconds: number; // 5 hours = 18000s
  
  // Idle / Active detection
  isIdle: boolean; // if true, quota is not currently dropping sand
  lastUsedAt?: string;
  totalTokensUsedToday?: number;
}

export interface HeartbeatConfig {
  enabled: boolean;
  intervalSeconds: number; // default e.g. 30s
  lastHeartbeat: Date | null;
  latencyMs: number;
  status: 'online' | 'syncing' | 'offline' | 'simulated';
  apiEndpoint?: string;
  apiKey?: string;
}
