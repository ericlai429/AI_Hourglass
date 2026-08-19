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
  <!-- Main Container: Centered iPhone 13 mini frame with max-w-[390px] for desktop preview -->
  <main class="min-h-screen w-full flex flex-col items-center justify-between p-3 pt-safe pb-safe bg-[#060911] text-slate-100 overflow-x-hidden">
    
    <div class="w-full max-w-[390px] flex flex-col items-center flex-1 justify-between gap-3">
      
      <!-- Top Header Navigation & Action Bar -->
      <header class="w-full flex items-center justify-between px-1 pt-1 gap-2">
        <div class="flex items-center gap-1.5 min-w-0">
          <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
            <Zap class="w-4 h-4 text-white" />
          </div>
          <!-- Account Switcher Pill (Default: oocai0001@gmail.com & ericlai429@gmail.com) -->
          <AccountSwitcher />
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            @click="isIpaOpen = true"
            class="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-all active:scale-95"
            title="下載 / 打包 IPA & PWA"
          >
            <Apple class="w-4 h-4" />
          </button>

          <button
            @click="isSettingsOpen = true"
            class="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-all active:scale-95"
            title="設定"
          >
            <Settings class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Model Category Selector Bar -->
      <section class="w-full">
        <ModelSelector />
      </section>

      <!-- Mode Switcher Pill (Crystal Ball <--> Dual Hourglass) -->
      <nav class="glass-pill p-1 rounded-2xl flex items-center justify-center gap-1 w-full max-w-xs shadow-inner">
        <button
          @click="displayMode = 'crystal'"
          class="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          :class="displayMode === 'crystal'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>🔮 水晶球藥水</span>
        </button>

        <button
          @click="displayMode = 'hourglass'"
          class="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          :class="displayMode === 'hourglass'
            ? 'bg-amber-600 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'"
        >
          <Hourglass class="w-3.5 h-3.5" />
          <span>⏳ 雙沙漏模式</span>
        </button>
      </nav>

      <!-- Center Dynamic Visual Stage -->
      <section class="w-full flex flex-col items-center justify-center my-auto py-1">
        <transition name="fade" mode="out-in">
          <CrystalBall v-if="displayMode === 'crystal'" key="crystal" />
          <DualHourglass v-else key="hourglass" />
        </transition>
      </section>

      <!-- Detailed Countdown Cards (Visible in Crystal Mode for full details) -->
      <section v-if="displayMode === 'crystal'" class="w-full flex flex-col items-center">
        <CountdownTimer />
      </section>

      <!-- Bottom Persistent Heartbeat Monitor Bar -->
      <footer class="w-full flex flex-col items-center gap-1.5 pb-1">
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
  transition: opacity 0.2s ease, transform 0.2s ease;
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
