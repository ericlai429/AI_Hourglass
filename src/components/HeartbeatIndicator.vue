<script setup lang="ts">
import { ref } from 'vue';
import { heartbeatConfig, startHeartbeat } from '../stores/quotaStore';
import { Activity, RefreshCw, Radio } from 'lucide-vue-next';

const isSpinning = ref(false);

const handleManualSync = () => {
  isSpinning.value = true;
  heartbeatConfig.status = 'syncing';
  setTimeout(() => {
    heartbeatConfig.lastHeartbeat = new Date();
    heartbeatConfig.latencyMs = Math.floor(18 + Math.random() * 30);
    heartbeatConfig.status = 'online';
    isSpinning.value = false;
  }, 400);
};

const formatTime = (d: Date | null) => {
  if (!d) return '--:--:--';
  return d.toTimeString().split(' ')[0];
};
</script>

<template>
  <div class="glass-pill px-3 py-1.5 rounded-full flex items-center justify-between w-full max-w-xs text-xs text-slate-300">
    <div class="flex items-center gap-2">
      <!-- Pulsing heartbeat dot -->
      <span class="relative flex h-2.5 w-2.5">
        <span
          v-if="heartbeatConfig.status === 'online'"
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-2.5 w-2.5"
          :class="heartbeatConfig.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'"
        ></span>
      </span>

      <span class="font-mono text-[11px]">
        常駐心跳: {{ heartbeatConfig.latencyMs }}ms
      </span>
      <span class="text-[10px] text-slate-500 font-mono">
        ({{ formatTime(heartbeatConfig.lastHeartbeat) }})
      </span>
    </div>

    <button
      @click="handleManualSync"
      class="p-1 hover:text-white text-slate-400 transition-all rounded-lg active:scale-95"
      title="手動同步算力心跳"
    >
      <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSpinning }" />
    </button>
  </div>
</template>
