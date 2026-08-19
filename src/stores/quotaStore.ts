import { reactive, ref, computed } from 'vue';
import type { ModelQuota, ModelType, DisplayMode, HeartbeatConfig, UserAccount } from '../types';

export const displayMode = ref<DisplayMode>('crystal');

// User Accounts (Default: oocai0001@gmail.com & ericlai429@gmail.com)
export const userAccounts = reactive<UserAccount[]>([
  {
    email: 'oocai0001@gmail.com',
    name: 'OOCAI Main',
    avatarBg: '#3b82f6',
    isDefault: true,
  },
  {
    email: 'ericlai429@gmail.com',
    name: 'Eric Lai',
    avatarBg: '#8b5cf6',
  },
]);

export const currentAccountEmail = ref<string>('oocai0001@gmail.com');

export const currentAccount = computed(() => {
  return userAccounts.find(a => a.email === currentAccountEmail.value) || userAccounts[0];
});

export function switchAccount(email: string) {
  currentAccountEmail.value = email;
  try {
    localStorage.setItem('ai_hourglass_account', email);
  } catch (e) {}
}

export function addAccount(email: string, name?: string) {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || userAccounts.some(a => a.email.toLowerCase() === trimmed)) return;
  userAccounts.push({
    email: trimmed,
    name: name || trimmed.split('@')[0],
    avatarBg: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
  });
  switchAccount(trimmed);
}

export const models: Record<ModelType, ModelQuota> = reactive({
  gemini: {
    id: 'gemini',
    name: 'Gemini Models',
    badge: 'Gemini 2.5 & 3.7',
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    potionColor: {
      top: '#60a5fa',
      bottom: '#1e40af',
      glow: 'rgba(96, 165, 250, 0.6)',
      particle: '#dbeafe',
    },
    sandColor: {
      primary: '#3b82f6',
      secondary: '#93c5fd',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    weeklyRemainingPct: 89,
    weeklyRefreshSeconds: 6 * 86400 + 3 * 3600, // 6d 3h
    weeklyTotalSeconds: 7 * 86400,
    fiveHourRemainingPct: 75,
    fiveHourRefreshSeconds: 1 * 3600 + 1 * 60, // 1h 1m
    fiveHourTotalSeconds: 5 * 3600,
    isIdle: false,
    totalTokensUsedToday: 42800,
  },
  claude: {
    id: 'claude',
    name: 'Claude & GPT Models',
    badge: 'Claude 3.7 & GPT-4o',
    themeColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.5)',
    potionColor: {
      top: '#fb923c',
      bottom: '#9a3412',
      glow: 'rgba(251, 146, 60, 0.6)',
      particle: '#ffedd5',
    },
    sandColor: {
      primary: '#ea580c',
      secondary: '#fdba74',
      glow: 'rgba(234, 88, 12, 0.35)',
    },
    weeklyRemainingPct: 66,
    weeklyRefreshSeconds: 1 * 86400 + 5 * 3600, // 1d 5h
    weeklyTotalSeconds: 7 * 86400,
    fiveHourRemainingPct: 100,
    fiveHourRefreshSeconds: 5 * 3600,
    fiveHourTotalSeconds: 5 * 3600,
    isIdle: true,
    totalTokensUsedToday: 18400,
  },
  gpt: {
    id: 'gpt',
    name: 'OpenAI GPT-4.5/o1',
    badge: 'Codex & Reasoning',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    potionColor: {
      top: '#34d399',
      bottom: '#065f46',
      glow: 'rgba(52, 211, 153, 0.6)',
      particle: '#d1fae5',
    },
    sandColor: {
      primary: '#10b981',
      secondary: '#6ee7b7',
      glow: 'rgba(16, 185, 129, 0.35)',
    },
    weeklyRemainingPct: 94,
    weeklyRefreshSeconds: 5 * 86400 + 18 * 3600,
    weeklyTotalSeconds: 7 * 86400,
    fiveHourRemainingPct: 88,
    fiveHourRefreshSeconds: 3 * 3600 + 40 * 60,
    fiveHourTotalSeconds: 5 * 3600,
    isIdle: false,
    totalTokensUsedToday: 12500,
  },
  custom: {
    id: 'custom',
    name: 'Custom Endpoint',
    badge: 'Self-Hosted / OpenRouter',
    themeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    potionColor: {
      top: '#c084fc',
      bottom: '#6b21a8',
      glow: 'rgba(192, 132, 252, 0.6)',
      particle: '#f3e8ff',
    },
    sandColor: {
      primary: '#a855f7',
      secondary: '#d8b4fe',
      glow: 'rgba(168, 85, 247, 0.35)',
    },
    weeklyRemainingPct: 80,
    weeklyRefreshSeconds: 3 * 86400 + 12 * 3600,
    weeklyTotalSeconds: 7 * 86400,
    fiveHourRemainingPct: 50,
    fiveHourRefreshSeconds: 2 * 3600 + 30 * 60,
    fiveHourTotalSeconds: 5 * 3600,
    isIdle: false,
    totalTokensUsedToday: 8000,
  },
});

export const selectedModelId = ref<ModelType>('gemini');

export const currentModel = computed(() => models[selectedModelId.value]);

// Heartbeat & Timer Config
export const heartbeatConfig = reactive<HeartbeatConfig>({
  enabled: true,
  intervalSeconds: 15,
  lastHeartbeat: new Date(),
  latencyMs: 42,
  status: 'online',
  apiEndpoint: '',
  apiKey: '',
});

let timerInterval: number | null = null;
let heartbeatInterval: number | null = null;

// Parse URL Query parameters & Hash for instant PWA configuration
export function parseUrlParameters() {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // 0. Account parameter (?account=ericlai429@gmail.com)
    const accountParam = params.get('account');
    if (accountParam) {
      if (!userAccounts.some(a => a.email.toLowerCase() === accountParam.toLowerCase())) {
        addAccount(accountParam);
      } else {
        switchAccount(accountParam);
      }
    } else {
      const savedAccount = localStorage.getItem('ai_hourglass_account');
      if (savedAccount && userAccounts.some(a => a.email === savedAccount)) {
        currentAccountEmail.value = savedAccount;
      }
    }

    // 1. Display Mode (?mode=crystal | hourglass)
    const modeParam = params.get('mode');
    if (modeParam === 'crystal' || modeParam === 'hourglass') {
      displayMode.value = modeParam;
    }

    // 2. Target Model (?model=gemini | claude | gpt | custom)
    const modelParam = params.get('model') as ModelType;
    if (modelParam && models[modelParam]) {
      selectedModelId.value = modelParam;
    }

    // 3. Model-specific overrides
    const target = models[selectedModelId.value];
    if (params.has('weekly')) {
      target.weeklyRemainingPct = Math.min(100, Math.max(0, parseInt(params.get('weekly') || '100')));
    }
    if (params.has('5h') || params.has('fiveHour')) {
      target.fiveHourRemainingPct = Math.min(100, Math.max(0, parseInt(params.get('5h') || params.get('fiveHour') || '100')));
    }
    if (params.has('weeklySec')) {
      target.weeklyRefreshSeconds = parseInt(params.get('weeklySec') || '0');
    }
    if (params.has('5hSec') || params.has('fiveHourSec')) {
      target.fiveHourRefreshSeconds = parseInt(params.get('5hSec') || params.get('fiveHourSec') || '0');
    }
    if (params.has('idle')) {
      target.isIdle = params.get('idle') === '1' || params.get('idle') === 'true';
    }

    // 4. Custom API endpoint (?api=https://...&key=sk-...)
    if (params.has('api')) {
      heartbeatConfig.apiEndpoint = params.get('api') || '';
    }
    if (params.has('key')) {
      heartbeatConfig.apiKey = params.get('key') || '';
    }
  } catch (e) {
    console.warn('URL parameter parsing failed:', e);
  }
}

// Generate shareable PWA URL containing current status and account
export function generateShareableUrl(): string {
  const url = new URL(window.location.origin + window.location.pathname);
  const m = currentModel.value;
  url.searchParams.set('account', currentAccountEmail.value);
  url.searchParams.set('model', m.id);
  url.searchParams.set('mode', displayMode.value);
  url.searchParams.set('weekly', m.weeklyRemainingPct.toString());
  url.searchParams.set('5h', m.fiveHourRemainingPct.toString());
  url.searchParams.set('weeklySec', m.weeklyRefreshSeconds.toString());
  url.searchParams.set('5hSec', m.fiveHourRefreshSeconds.toString());
  url.searchParams.set('idle', m.isIdle ? '1' : '0');
  return url.toString();
}

// Format seconds into "X天 Y小時 Z分" or "Y小時 Z分 W秒"
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '已刷新 (100%)';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days} 天 ${hours} 小時`;
  }
  if (hours > 0) {
    return `${hours} 小時 ${minutes} 分`;
  }
  return `${minutes} 分 ${secs} 秒`;
}

// Start live tick countdown
export function initQuotaStore() {
  parseUrlParameters();

  if (timerInterval) return;

  // Real-time second countdown ticker
  timerInterval = window.setInterval(() => {
    Object.values(models).forEach((model) => {
      // 5-Hour Countdown
      if (model.fiveHourRefreshSeconds > 0) {
        model.fiveHourRefreshSeconds -= 1;
        if (model.fiveHourRefreshSeconds <= 0) {
          model.fiveHourRemainingPct = 100;
          model.fiveHourRefreshSeconds = model.fiveHourTotalSeconds;
          model.isIdle = true;
        }
      }

      // Weekly Countdown
      if (model.weeklyRefreshSeconds > 0) {
        model.weeklyRefreshSeconds -= 1;
        if (model.weeklyRefreshSeconds <= 0) {
          model.weeklyRemainingPct = 100;
          model.weeklyRefreshSeconds = model.weeklyTotalSeconds;
        }
      }
    });
  }, 1000);

  // Heartbeat ping interval
  startHeartbeat();
}

export function startHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  
  heartbeatInterval = window.setInterval(() => {
    if (!heartbeatConfig.enabled) return;
    
    heartbeatConfig.status = 'syncing';
    // Simulate real network jitter (25ms - 80ms)
    setTimeout(() => {
      heartbeatConfig.lastHeartbeat = new Date();
      heartbeatConfig.latencyMs = Math.floor(25 + Math.random() * 45);
      heartbeatConfig.status = 'online';
    }, 300);
  }, heartbeatConfig.intervalSeconds * 1000);
}

// Manually trigger a quick usage simulation
export function simulateUsage(modelId: ModelType, costPct: number = 3) {
  const model = models[modelId];
  model.fiveHourRemainingPct = Math.max(0, model.fiveHourRemainingPct - costPct);
  model.weeklyRemainingPct = Math.max(0, model.weeklyRemainingPct - Math.round(costPct * 0.4));
  model.isIdle = false;
  model.totalTokensUsedToday = (model.totalTokensUsedToday || 0) + 1500;
}

// Toggle Idle state manually
export function toggleIdle(modelId: ModelType) {
  const model = models[modelId];
  model.isIdle = !model.isIdle;
}
