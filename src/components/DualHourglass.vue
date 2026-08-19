<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { currentModel, formatDuration, simulateUsage, toggleIdle } from '../stores/quotaStore';
import { HourglassRenderer } from '../engine/SandPhysics';
import { Hourglass, Pause, Play, Flame } from 'lucide-vue-next';

const weeklyCanvasRef = ref<HTMLCanvasElement | null>(null);
const fiveHourCanvasRef = ref<HTMLCanvasElement | null>(null);

let weeklyRenderer: HourglassRenderer | null = null;
let fiveHourRenderer: HourglassRenderer | null = null;

const syncRenderers = () => {
  const m = currentModel.value;

  if (weeklyRenderer) {
    weeklyRenderer.remainingPct = m.weeklyRemainingPct;
    weeklyRenderer.primaryColor = m.sandColor.primary;
    weeklyRenderer.secondaryColor = m.sandColor.secondary;
    weeklyRenderer.glowColor = m.sandColor.glow;
    weeklyRenderer.isIdle = m.isIdle;
  }

  if (fiveHourRenderer) {
    fiveHourRenderer.remainingPct = m.fiveHourRemainingPct;
    fiveHourRenderer.primaryColor = m.sandColor.primary;
    fiveHourRenderer.secondaryColor = m.sandColor.secondary;
    fiveHourRenderer.glowColor = m.sandColor.glow;
    // If 100% remaining or explicitly idle, do not drop sand!
    fiveHourRenderer.isIdle = m.isIdle || m.fiveHourRemainingPct >= 100;
  }
};

onMounted(() => {
  if (weeklyCanvasRef.value) {
    weeklyRenderer = new HourglassRenderer(weeklyCanvasRef.value);
    weeklyRenderer.title = '週額度';
    weeklyRenderer.start();
  }

  if (fiveHourCanvasRef.value) {
    fiveHourRenderer = new HourglassRenderer(fiveHourCanvasRef.value);
    fiveHourRenderer.title = '5小時額度';
    fiveHourRenderer.start();
  }

  syncRenderers();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  if (weeklyRenderer) weeklyRenderer.stop();
  if (fiveHourRenderer) fiveHourRenderer.stop();
  window.removeEventListener('resize', onResize);
});

const onResize = () => {
  if (weeklyRenderer) {
    weeklyRenderer.resize();
  }
  if (fiveHourRenderer) {
    fiveHourRenderer.resize();
  }
  syncRenderers();
};

watch(() => [
  currentModel.value.id,
  currentModel.value.weeklyRemainingPct,
  currentModel.value.fiveHourRemainingPct,
  currentModel.value.isIdle
], () => {
  syncRenderers();
}, { deep: true });

const handleTapWeekly = () => {
  simulateUsage(currentModel.value.id, 2);
};

const handleTapFiveHour = () => {
  simulateUsage(currentModel.value.id, 5);
};

const handleToggleIdle = () => {
  toggleIdle(currentModel.value.id);
};
</script>

<template>
  <div class="flex flex-col items-center w-full px-2">
    <!-- Sand State Control Bar -->
    <div class="flex items-center justify-between w-full max-w-xs mb-2 px-2">
      <div class="flex items-center gap-1.5 text-xs text-slate-400">
        <Hourglass class="w-3.5 h-3.5 text-amber-400" />
        <span class="font-mono text-[11px]">物理動態沙漏</span>
      </div>

      <button
        @click="handleToggleIdle"
        class="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border transition-all"
        :class="currentModel.isIdle 
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80' 
          : 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900/80'"
      >
        <component :is="currentModel.isIdle ? Play : Pause" class="w-3 h-3" />
        <span>{{ currentModel.isIdle ? '沙子靜止 (閒置)' : '落沙中 (消耗)' }}</span>
      </button>
    </div>

    <!-- Dual Hourglass Stage (Big Weekly + Small 5hr) -->
    <div class="grid grid-cols-2 gap-3 w-full max-w-xs items-end">
      
      <!-- Big Hourglass: Weekly Limit -->
      <div
        class="glass-panel p-2.5 rounded-2xl flex flex-col items-center relative overflow-hidden group cursor-pointer"
        @click="handleTapWeekly"
      >
        <div class="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
          <span>大沙漏 · 週額度</span>
        </div>

        <div class="w-full h-44 relative flex items-center justify-center">
          <canvas ref="weeklyCanvasRef" class="w-full h-full"></canvas>
          
          <!-- Bottom Center Pill Indicator -->
          <div class="absolute bottom-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/10 text-center">
            <span class="text-xs font-bold font-mono text-white">{{ currentModel.weeklyRemainingPct }}%</span>
          </div>
        </div>

        <div class="w-full text-center mt-1.5 pt-1 border-t border-white/5">
          <div class="text-[10px] text-slate-400 font-mono">完全刷新倒數</div>
          <div class="text-[11px] font-mono font-medium text-amber-200 truncate">
            {{ formatDuration(currentModel.weeklyRefreshSeconds) }}
          </div>
        </div>
      </div>

      <!-- Small Hourglass: 5-Hour Limit -->
      <div
        class="glass-panel p-2.5 rounded-2xl flex flex-col items-center relative overflow-hidden group cursor-pointer"
        @click="handleTapFiveHour"
      >
        <div class="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
          <span>小沙漏 · 5小時</span>
        </div>

        <div class="w-full h-44 relative flex items-center justify-center">
          <canvas ref="fiveHourCanvasRef" class="w-full h-full"></canvas>

          <!-- Status badge if 100% idle -->
          <div
            v-if="currentModel.fiveHourRemainingPct >= 100"
            class="absolute top-8 bg-emerald-950/90 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-500/40"
          >
            滿額未消耗
          </div>

          <!-- Bottom Center Pill Indicator -->
          <div class="absolute bottom-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/10 text-center">
            <span class="text-xs font-bold font-mono text-white">{{ currentModel.fiveHourRemainingPct }}%</span>
          </div>
        </div>

        <div class="w-full text-center mt-1.5 pt-1 border-t border-white/5">
          <div class="text-[10px] text-slate-400 font-mono">重置倒數計時</div>
          <div class="text-[11px] font-mono font-medium text-cyan-200 truncate">
            {{ formatDuration(currentModel.fiveHourRefreshSeconds) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Tip -->
    <div class="text-[10px] text-slate-500 font-mono mt-2 text-center">
      💡 提示：點擊沙漏可模擬算力消耗；未消耗時沙子自動停止下落
    </div>
  </div>
</template>
