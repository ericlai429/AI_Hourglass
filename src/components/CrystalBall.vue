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
    <!-- Compact Crystal Orb Canvas Wrapper (Shrunk by 25%) -->
    <div class="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
      <canvas
        ref="canvasRef"
        class="w-full h-full cursor-pointer touch-none"
        @click="handleQuickConsume"
      ></canvas>

      <!-- Center Floating Metric Badge -->
      <div class="absolute flex flex-col items-center pointer-events-none drop-shadow-md">
        <div class="flex items-center gap-1 px-2 py-0.2 rounded-full bg-slate-950/75 border border-white/10 backdrop-blur-md mb-0.5">
          <Sparkles class="w-2.5 h-2.5 text-amber-300 animate-pulse" />
          <span class="text-[9px] font-mono tracking-wider uppercase text-slate-300">5-Hour Potion</span>
        </div>
        <div class="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline leading-none my-0.5">
          <span>{{ currentModel.fiveHourRemainingPct }}</span>
          <span class="text-base text-slate-300 font-normal ml-0.5">%</span>
        </div>
        <span class="text-[10px] text-slate-300/80 font-mono">
          {{ formatDuration(currentModel.fiveHourRefreshSeconds) }}
        </span>
      </div>

      <!-- Idle / Active Status Floating Badge -->
      <div class="absolute top-0 right-1">
        <span
          v-if="currentModel.isIdle"
          class="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 靜止
        </span>
        <span
          v-else
          class="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse"
        >
          <Flame class="w-2 h-2 text-amber-400" /> 燃燒中
        </span>
      </div>
    </div>
  </div>
</template>
