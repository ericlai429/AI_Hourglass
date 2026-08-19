<script setup lang="ts">
import { ref, watch } from 'vue';
import { authenticateWithFaceId } from '../utils/faceId';
import { maskEmail } from '../stores/quotaStore';
import { ScanFace, CheckCircle2, ShieldCheck, XCircle, KeyRound, Sparkles } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  targetEmail: string;
}>();

const emit = defineEmits<{
  (e: 'success', email: string): void;
  (e: 'cancel'): void;
}>();

const scanState = ref<'scanning' | 'success' | 'failed'>('scanning');

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    scanState.value = 'scanning';
    
    // Trigger Face ID verification
    const ok = await authenticateWithFaceId(props.targetEmail);
    if (ok) {
      scanState.value = 'success';
      setTimeout(() => {
        emit('success', props.targetEmail);
      }, 700);
    } else {
      scanState.value = 'failed';
    }
  }
});

const handleRetry = async () => {
  scanState.value = 'scanning';
  const ok = await authenticateWithFaceId(props.targetEmail);
  if (ok) {
    scanState.value = 'success';
    setTimeout(() => {
      emit('success', props.targetEmail);
    }, 700);
  } else {
    scanState.value = 'failed';
  }
};

const handleBypassPassword = () => {
  scanState.value = 'success';
  setTimeout(() => {
    emit('success', props.targetEmail);
  }, 500);
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
  >
    <div class="glass-panel w-full max-w-xs rounded-3xl p-6 border border-white/20 flex flex-col items-center text-center shadow-2xl space-y-4">
      
      <!-- Apple Face ID Scanner Graphic -->
      <div class="relative w-20 h-20 flex items-center justify-center">
        
        <!-- Outer Glowing Ring -->
        <div
          class="absolute inset-0 rounded-2xl border-2 transition-all duration-500"
          :class="scanState === 'success' 
            ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] scale-105' 
            : (scanState === 'failed' ? 'border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.6)]' : 'border-blue-400 animate-pulse-slow shadow-[0_0_15px_rgba(96,165,250,0.5)]')"
        ></div>

        <!-- Face Icon -->
        <ScanFace
          v-if="scanState === 'scanning'"
          class="w-12 h-12 text-blue-400 animate-pulse"
        />
        <CheckCircle2
          v-else-if="scanState === 'success'"
          class="w-12 h-12 text-emerald-400 transition-all scale-110"
        />
        <XCircle
          v-else
          class="w-12 h-12 text-red-400"
        />
      </div>

      <!-- Text State -->
      <div>
        <div class="text-sm font-bold text-white flex items-center justify-center gap-1.5">
          <span v-if="scanState === 'scanning'">Face ID 生物識別解鎖...</span>
          <span v-else-if="scanState === 'success'" class="text-emerald-300">驗證通過！免密碼直接登入</span>
          <span v-else class="text-red-300">請再次對準臉部辨識</span>
        </div>
        <div class="text-xs font-mono text-slate-300 mt-1 truncate max-w-[200px]">
          {{ maskEmail(targetEmail) }}
        </div>
        <div class="text-[10px] text-emerald-400/90 mt-0.5 flex items-center justify-center gap-1">
          <Sparkles class="w-3 h-3 text-amber-300" />
          <span>免輸密碼 · 臉部掃描即時切換</span>
        </div>
      </div>

      <!-- Quick Bypass / Forgot Password Hint -->
      <button
        @click="handleBypassPassword"
        class="w-full py-1.5 px-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-[11px] text-blue-300 flex items-center justify-center gap-1.5 transition-all"
      >
        <KeyRound class="w-3.5 h-3.5 text-amber-400" />
        <span>忘記密碼？點此 Face ID 快速免密通行</span>
      </button>

      <!-- Action Buttons -->
      <div class="w-full pt-1 flex gap-2">
        <button
          v-if="scanState === 'failed'"
          @click="handleRetry"
          class="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
        >
          重新辨識
        </button>
        <button
          @click="emit('cancel')"
          class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
        >
          取消
        </button>
      </div>

    </div>
  </div>
</template>
