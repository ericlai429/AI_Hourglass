<script setup lang="ts">
import { ref } from 'vue';
import { currentModel, heartbeatConfig, userAccounts, currentAccountEmail, switchAccount, addAccount } from '../stores/quotaStore';
import { X, Sliders, Shield, Key, Check, Mail, Plus } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const newEmailInput = ref('');

const handleAddEmail = () => {
  if (newEmailInput.value.trim()) {
    addAccount(newEmailInput.value.trim());
    newEmailInput.value = '';
  }
};
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
          <h2 class="text-base font-bold text-white">設定 & 帳號管理</h2>
        </div>
        <button @click="emit('close')" class="p-1 rounded-full text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Account Management Section -->
      <div class="space-y-2">
        <h3 class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Mail class="w-4 h-4 text-indigo-400" />
          <span>綁定登入信箱切換</span>
        </h3>

        <div class="space-y-1.5">
          <button
            v-for="acc in userAccounts"
            :key="acc.email"
            @click="switchAccount(acc.email)"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs border"
            :class="currentAccountEmail === acc.email
              ? 'bg-blue-600/30 border-blue-500 text-white'
              : 'border-white/5 bg-slate-900/40 text-slate-300 hover:bg-white/5'"
          >
            <span class="font-mono">{{ acc.email }}</span>
            <span v-if="currentAccountEmail === acc.email" class="text-[10px] text-blue-300 font-semibold">當前使用中</span>
          </button>
        </div>

        <div class="flex gap-1.5 pt-1">
          <input
            type="email"
            v-model="newEmailInput"
            placeholder="新增信箱 (如 you@gmail.com)"
            class="flex-1 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            @keyup.enter="handleAddEmail"
          />
          <button
            @click="handleAddEmail"
            class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl flex items-center gap-1 shrink-0"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>新增</span>
          </button>
        </div>
      </div>

      <!-- Current Model Quota Quick Sliders -->
      <div class="border-t border-white/10 pt-3 space-y-3">
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
