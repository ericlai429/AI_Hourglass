<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { displayMode, initQuotaStore, currentModel } from './stores/quotaStore';
import CrystalBall from './components/CrystalBall.vue';
import DualHourglass from './components/DualHourglass.vue';
import ModelSelector from './components/ModelSelector.vue';
import HeartbeatIndicator from './components/HeartbeatIndicator.vue';
import CountdownTimer from './components/CountdownTimer.vue';
import SettingsModal from './components/SettingsModal.vue';
import IpaExportModal from './components/IpaExportModal.vue';
import AccountSwitcher from './components/AccountSwitcher.vue';
import { Sparkles, Hourglass, Settings, Apple, Zap } from 'lucide-vue-next';

const isSettingsOpen = ref(false);
const isIpaOpen = ref(false);

onMounted(() => {
  initQuotaStore();
});
</script>

<template>
  <!-- Single Page Viewport Optimized for iPhone 13 mini (100dvh strictly fits in 1 screen) -->
  <main class="h-[100dvh] max-h-[100dvh] w-full flex flex-col items-center justify-between p-2.5 pt-safe pb-safe bg-[#060911] text-slate-100 overflow-hidden select-none">
    
    <div class="w-full max-w-[390px] h-full flex flex-col items-center justify-between gap-1.5 min-h-0">
      
      <!-- Top Header Navigation & Action Bar -->
      <header class="w-full flex items-center justify-between px-0.5 pt-0.5 gap-1 shrink-0">
        <div class="flex items-center gap-1.5 min-w-0">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
            <Zap class="w-3.5 h-3.5 text-white" />
          </div>
          <!-- Account Switcher Pill -->
          <AccountSwitcher />
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            @click="isIpaOpen = true"
            class="p-1.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-all active:scale-95"
            title="下載 / 打包 IPA & PWA"
          >
            <Apple class="w-3.5 h-3.5" />
          </button>

          <button
            @click="isSettingsOpen = true"
            class="p-1.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-all active:scale-95"
            title="設定"
          >
            <Settings class="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <!-- Model Category Selector Bar -->
      <section class="w-full shrink-0">
        <ModelSelector />
      </section>

      <!-- Mode Switcher Pill (Crystal Ball <--> Dual Hourglass) -->
      <nav class="glass-pill p-0.5 rounded-xl flex items-center justify-center gap-1 w-full max-w-xs shadow-inner shrink-0">
        <button
          @click="displayMode = 'crystal'"
          class="flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          :class="displayMode === 'crystal'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'"
        >
          <Sparkles class="w-3 h-3" />
          <span>🔮 水晶球藥水</span>
        </button>

        <button
          @click="displayMode = 'hourglass'"
          class="flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          :class="displayMode === 'hourglass'
            ? 'bg-amber-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'"
        >
          <Hourglass class="w-3 h-3" />
          <span>⏳ 雙沙漏模式</span>
        </button>
      </nav>

      <!-- Center Dynamic Visual Stage -->
      <section class="w-full flex flex-col items-center justify-center my-auto shrink-0">
        <transition name="fade" mode="out-in">
          <CrystalBall v-if="displayMode === 'crystal'" key="crystal" />
          <DualHourglass v-else key="hourglass" />
        </transition>
      </section>

      <!-- Detailed Countdown Cards (Visible in Crystal Mode) -->
      <section v-if="displayMode === 'crystal'" class="w-full flex flex-col items-center shrink-0">
        <CountdownTimer />
      </section>

      <!-- Bottom Persistent Heartbeat Monitor Bar -->
      <footer class="w-full flex flex-col items-center gap-1 pb-0.5 shrink-0">
        <HeartbeatIndicator />
      </footer>

    </div>

    <!-- Modals -->
    <SettingsModal :isOpen="isSettingsOpen" @close="isSettingsOpen = false" />
    <IpaExportModal :isOpen="isIpaOpen" @close="isIpaOpen = false" />
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}
</style>
