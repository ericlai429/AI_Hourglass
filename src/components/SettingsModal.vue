<script setup lang="ts">
import { currentModel, heartbeatConfig, models } from '../stores/quotaStore';
import { X, Sliders, Shield, Key, RefreshCw, Check } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    @click.self="emit('close')"
  >
    <div class="glass-panel w-full max-w-sm rounded-3xl p-5 border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <Sliders class="w-5 h-5 text-blue-400" />
          <h2 class="text-base font-bold text-white">算力心跳 & 模型設定</h2>
        </div>
        <button @click="emit('close')" class="p-1 rounded-full text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Current Model Quota Quick Sliders -->
      <div class="space-y-3">
        <h3 class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <span>調整當前模型 ({{ currentModel.name }}) 額度</span>
        </h3>

        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span>5 小時額度 (%)</span>
            <span class="font-mono text-white">{{ currentModel.fiveHourRemainingPct }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="currentModel.fiveHourRemainingPct"
            class="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span>每週額度 (%)</span>
            <span class="font-mono text-white">{{ currentModel.weeklyRemainingPct }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            v-model.number="currentModel.weeklyRemainingPct"
            class="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      <!-- Heartbeat Frequency Config -->
      <div class="border-t border-white/10 pt-3 space-y-2">
        <h3 class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Shield class="w-4 h-4 text-emerald-400" />
          <span>常駐心跳頻率</span>
        </h3>
        
        <div class="grid grid-cols-3 gap-2 text-xs font-mono">
          <button
            v-for="sec in [5, 15, 60]"
            :key="sec"
            @click="heartbeatConfig.intervalSeconds = sec"
            class="py-1.5 rounded-xl border text-center transition-all"
            :class="heartbeatConfig.intervalSeconds === sec 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
              : 'border-white/10 text-slate-400 hover:bg-white/5'"
          >
            {{ sec }} 秒
          </button>
        </div>
      </div>

      <!-- API / Session Key Authentication -->
      <div class="border-t border-white/10 pt-3 space-y-2">
        <h3 class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Key class="w-4 h-4 text-purple-400" />
          <span>自訂 API / Token 心跳端點</span>
        </h3>

        <div class="space-y-2 text-xs">
          <input
            type="text"
            v-model="heartbeatConfig.apiEndpoint"
            placeholder="https://api.openai.com/v1 或自訂代理"
            class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            v-model="heartbeatConfig.apiKey"
            placeholder="sk-xxxxxxxxxx (可選 Token)"
            class="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        @click="emit('close')"
        class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-1.5"
      >
        <Check class="w-4 h-4" />
        <span>儲存並關閉</span>
      </button>
    </div>
  </div>
</template>
