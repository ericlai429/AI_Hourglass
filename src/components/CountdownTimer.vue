<script setup lang="ts">
import { currentModel, formatDuration } from '../stores/quotaStore';
import { Clock, Calendar, ShieldCheck, Zap } from 'lucide-vue-next';
</script>

<template>
  <div class="w-full max-w-xs space-y-2">
    <!-- 5-Hour Limit Card -->
    <div class="glass-panel p-3 rounded-2xl flex items-center justify-between border-l-4 border-l-blue-500">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-blue-500/10 text-blue-400">
          <Clock class="w-4 h-4" />
        </div>
        <div>
          <div class="text-[11px] text-slate-400 font-medium">5 小時短期額度</div>
          <div class="text-sm font-bold font-mono text-white flex items-center gap-2">
            <span>{{ currentModel.fiveHourRemainingPct }}%</span>
            <span
              v-if="currentModel.fiveHourRemainingPct === 100"
              class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-normal border border-emerald-500/30"
            >
              全滿
            </span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-[10px] text-slate-400 font-mono">重置倒數</div>
        <div class="text-xs font-mono font-semibold text-blue-300">
          {{ formatDuration(currentModel.fiveHourRefreshSeconds) }}
        </div>
      </div>
    </div>

    <!-- Weekly Limit Card -->
    <div class="glass-panel p-3 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400">
          <Calendar class="w-4 h-4" />
        </div>
        <div>
          <div class="text-[11px] text-slate-400 font-medium">每週額度存量</div>
          <div class="text-sm font-bold font-mono text-white">
            {{ currentModel.weeklyRemainingPct }}%
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-[10px] text-slate-400 font-mono">重置倒數</div>
        <div class="text-xs font-mono font-semibold text-amber-300">
          {{ formatDuration(currentModel.weeklyRefreshSeconds) }}
        </div>
      </div>
    </div>
  </div>
</template>
