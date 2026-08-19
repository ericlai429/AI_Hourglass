<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { currentModel, formatDuration, simulateUsage } from '../stores/quotaStore';
import { CrystalBallRenderer } from '../engine/LiquidPhysics';
import { Sparkles, Zap, Flame } from 'lucide-vue-next';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let renderer: CrystalBallRenderer | null = null;

const syncRenderer = () => {
  if (!renderer) return;
  const m = currentModel.value;
  renderer.remainingPct = m.fiveHourRemainingPct;
  renderer.topColor = m.potionColor.top;
  renderer.bottomColor = m.potionColor.bottom;
  renderer.glowColor = m.potionColor.glow;
  renderer.particleColor = m.potionColor.particle;
  renderer.isIdle = m.isIdle;
};

onMounted(() => {
  if (canvasRef.value) {
    renderer = new CrystalBallRenderer(canvasRef.value);
    syncRenderer();
    renderer.start();
  }

  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  if (renderer) {
    renderer.stop();
    renderer = null;
  }
  window.removeEventListener('resize', onResize);
});

const onResize = () => {
  if (renderer) {
    renderer.resize();
    syncRenderer();
  }
};

watch(() => [
  currentModel.value.id,
  currentModel.value.fiveHourRemainingPct,
  currentModel.value.isIdle
], () => {
  syncRenderer();
}, { deep: true });

const handleQuickConsume = () => {
  simulateUsage(currentModel.value.id, 5);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center relative w-full select-none">
    <!-- Crystal Orb Canvas Wrapper -->
    <div class="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
      <canvas
        ref="canvasRef"
        class="w-full h-full cursor-pointer touch-none"
        @click="handleQuickConsume"
      ></canvas>

      <!-- Center Floating Metric Badge -->
      <div class="absolute flex flex-col items-center pointer-events-none drop-shadow-md">
        <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md mb-1">
          <Sparkles class="w-3 h-3 text-amber-300 animate-pulse" />
          <span class="text-[10px] font-mono tracking-wider uppercase text-slate-300">5-Hour Potion</span>
        </div>
        <div class="text-4xl font-extrabold font-mono tracking-tight text-white flex items-baseline">
          <span>{{ currentModel.fiveHourRemainingPct }}</span>
          <span class="text-xl text-slate-300 font-normal ml-0.5">%</span>
        </div>
        <span class="text-[11px] text-slate-300/80 font-mono mt-0.5">
          {{ formatDuration(currentModel.fiveHourRefreshSeconds) }}
        </span>
      </div>

      <!-- Idle / Active Status Floating Badge -->
      <div class="absolute -top-1 right-2">
        <span
          v-if="currentModel.isIdle"
          class="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 靜止待機
        </span>
        <span
          v-else
          class="px-2 py-0.5 text-[10px] font-mono rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse"
        >
          <Flame class="w-2.5 h-2.5 text-amber-400" /> 算力燃燒中
        </span>
      </div>
    </div>

    <!-- Secondary Weekly Potion Level Bar -->
    <div class="w-full max-w-xs mt-3 px-3">
      <div class="glass-panel p-3 rounded-2xl flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: currentModel.glowColor }"
          >
            <Zap class="w-4 h-4 text-white" />
          </div>
          <div>
            <div class="text-xs text-slate-400 font-medium">每週額度存量</div>
            <div class="text-sm font-bold font-mono text-white">
              {{ currentModel.weeklyRemainingPct }}%
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-[10px] text-slate-400 font-mono">完全刷新倒數</div>
          <div class="text-xs font-mono font-medium text-slate-200">
            {{ formatDuration(currentModel.weeklyRefreshSeconds) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
