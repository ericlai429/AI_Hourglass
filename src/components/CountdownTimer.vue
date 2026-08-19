<script setup lang="ts">
import { currentModel, formatDuration } from '../stores/quotaStore';
import { Clock, Calendar } from 'lucide-vue-next';
</script>

<template>
  <div class="w-full max-w-xs grid grid-cols-2 gap-2">
    <!-- 5-Hour Limit Card -->
    <div class="glass-panel p-2 rounded-2xl flex flex-col justify-between border-l-2 border-l-blue-500">
      <div class="flex items-center justify-between">
        <div class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Clock class="w-3 h-3 text-blue-400" />
          <span>5 小時額度</span>
        </div>
        <span
          v-if="currentModel.fiveHourRemainingPct === 100"
          class="text-[8px] px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30"
        >
          全滿
        </span>
      </div>
      
      <div class="my-0.5">
        <span class="text-base font-bold font-mono text-white">{{ currentModel.fiveHourRemainingPct }}%</span>
      </div>

      <div class="text-[9px] font-mono text-blue-300 truncate">
        {{ formatDuration(currentModel.fiveHourRefreshSeconds) }}
      </div>
    </div>

    <!-- Weekly Limit Card -->
    <div class="glass-panel p-2 rounded-2xl flex flex-col justify-between border-l-2 border-l-amber-500">
      <div class="flex items-center justify-between">
        <div class="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Calendar class="w-3 h-3 text-amber-400" />
          <span>每週額度存量</span>
        </div>
      </div>

      <div class="my-0.5">
        <span class="text-base font-bold font-mono text-white">{{ currentModel.weeklyRemainingPct }}%</span>
      </div>

      <div class="text-[9px] font-mono text-amber-300 truncate">
        {{ formatDuration(currentModel.weeklyRefreshSeconds) }}
      </div>
    </div>
  </div>
</template>
