<script setup lang="ts">
import { models, selectedModelId } from '../stores/quotaStore';
import type { ModelType } from '../types';

const selectModel = (id: ModelType) => {
  selectedModelId.value = id;
};

const getShortName = (id: ModelType) => {
  switch (id) {
    case 'gemini': return 'Gemini';
    case 'claude': return 'Claude';
    case 'gpt': return 'GPT';
    case 'custom': return '自訂';
  }
};
</script>

<template>
  <div class="w-full px-1">
    <div class="grid grid-cols-4 gap-1 p-1 rounded-2xl glass-panel border border-white/10 shadow-inner">
      <button
        v-for="model in Object.values(models)"
        :key="model.id"
        @click="selectModel(model.id)"
        class="py-1.5 px-1 rounded-xl text-[11px] font-medium transition-all relative flex flex-col items-center justify-center min-w-0"
        :class="selectedModelId === model.id
          ? 'bg-slate-800 text-white shadow-md border border-white/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent'"
      >
        <!-- Top row: Model Name + Glow dot -->
        <div class="flex items-center gap-1 leading-tight truncate">
          <span
            v-if="selectedModelId === model.id"
            class="w-1.5 h-1.5 rounded-full shrink-0"
            :style="{ backgroundColor: model.themeColor, boxShadow: `0 0 6px ${model.themeColor}` }"
          ></span>
          <span class="font-semibold truncate">{{ getShortName(model.id) }}</span>
        </div>
        
        <!-- Bottom row: 5h Percentage -->
        <span
          class="text-[10px] font-mono leading-none mt-0.5"
          :class="selectedModelId === model.id ? 'text-blue-300 font-bold' : 'text-slate-500'"
        >
          {{ model.fiveHourRemainingPct }}%
        </span>
      </button>
    </div>
  </div>
</template>
