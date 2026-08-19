<script setup lang="ts">
import { models, selectedModelId } from '../stores/quotaStore';
import type { ModelType } from '../types';
import { Sparkles } from 'lucide-vue-next';

const selectModel = (id: ModelType) => {
  selectedModelId.value = id;
};
</script>

<template>
  <div class="w-full flex items-center justify-center gap-1.5 px-2 py-1 overflow-x-auto no-scrollbar">
    <button
      v-for="model in Object.values(models)"
      :key="model.id"
      @click="selectModel(model.id)"
      class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all relative flex items-center gap-1.5 shrink-0"
      :class="selectedModelId === model.id
        ? 'bg-slate-800/90 text-white shadow-lg border border-white/20'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'"
    >
      <!-- Active glowing indicator -->
      <span
        v-if="selectedModelId === model.id"
        class="w-1.5 h-1.5 rounded-full"
        :style="{ backgroundColor: model.themeColor, boxShadow: `0 0 8px ${model.themeColor}` }"
      ></span>

      <span>{{ model.id === 'gemini' ? 'Gemini' : (model.id === 'claude' ? 'Claude / GPT' : (model.id === 'gpt' ? 'GPT-4.5' : '自訂')) }}</span>
      
      <!-- Small remaining badge -->
      <span
        class="text-[10px] font-mono px-1 rounded"
        :class="selectedModelId === model.id ? 'bg-white/10 text-slate-200' : 'text-slate-500'"
      >
        {{ model.fiveHourRemainingPct }}%
      </span>
    </button>
  </div>
</template>
