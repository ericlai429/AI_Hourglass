<script setup lang="ts">
import { ref } from 'vue';
import { generateShareableUrl } from '../stores/quotaStore';
import { X, Apple, Download, Terminal, Smartphone, Check, Share2, Link } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const copiedIpa = ref(false);
const copiedPwaUrl = ref(false);

const copyCommand = (cmd: string) => {
  navigator.clipboard.writeText(cmd);
  copiedIpa.value = true;
  setTimeout(() => (copiedIpa.value = false), 2000);
};

const copyShareUrl = () => {
  const url = generateShareableUrl();
  navigator.clipboard.writeText(url);
  copiedPwaUrl.value = true;
  setTimeout(() => (copiedPwaUrl.value = false), 2000);
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
          <Apple class="w-5 h-5 text-white" />
          <h2 class="text-base font-bold text-white">PWA 網址 & IPA 安裝</h2>
        </div>
        <button @click="emit('close')" class="p-1 rounded-full text-slate-400 hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="text-xs text-slate-300 space-y-3 leading-relaxed">
        
        <!-- PWA URL & Shortcut Sharing -->
        <div class="glass-panel p-3 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-2">
          <div class="font-bold text-blue-300 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <Share2 class="w-4 h-4" />
              <span>PWA 網址參數讀取與分享</span>
            </div>
            <button
              @click="copyShareUrl"
              class="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] flex items-center gap-1"
            >
              <component :is="copiedPwaUrl ? Check : Link" class="w-3 h-3" />
              <span>{{ copiedPwaUrl ? '已複製網址' : '複製專屬網址' }}</span>
            </button>
          </div>
          <p class="text-[11px] text-slate-300">
            支援透過 URL 參數直接加載算力狀態（例如：<code>?model=gemini&5h=75&weekly=89</code>）。複製後可在 iPhone 13 mini Safari「加入主畫面」直接離線使用！
          </p>
        </div>

        <!-- Method 1: Local Script -->
        <div class="glass-panel p-3 rounded-2xl border border-white/10 space-y-2">
          <div class="font-bold text-amber-300 flex items-center gap-1.5">
            <Terminal class="w-4 h-4" />
            <span>方法 1：本機一鍵生成 IPA 封裝</span>
          </div>
          <div class="bg-black/60 p-2 rounded-xl font-mono text-[11px] text-slate-300 flex items-center justify-between">
            <code>npm run package:ipa</code>
            <button @click="copyCommand('npm run package:ipa')" class="text-blue-400 hover:text-blue-300 text-xs">
              {{ copiedIpa ? '已複製' : '複製' }}
            </button>
          </div>
          <p class="text-[11px] text-slate-400">執行後會在專案根目錄產出 <code>ai-hourglass.ipa</code>，可直接透過 Sideloadly / AltStore / TrollStore 側載安裝至 iPhone 13 mini。</p>
        </div>

        <!-- Method 2: PWA / Standalone Safari -->
        <div class="glass-panel p-3 rounded-2xl border border-white/10 space-y-2">
          <div class="font-bold text-emerald-300 flex items-center gap-1.5">
            <Smartphone class="w-4 h-4" />
            <span>方法 2：iOS Safari 免簽名直裝 (PWA)</span>
          </div>
          <p class="text-[11px] text-slate-400">在 iPhone 13 mini 上用 Safari 打開本網站，點擊「分享」→「加入主畫面」，即可獲得全螢幕原生無邊框 App 體驗！</p>
        </div>

        <!-- Method 3: GitHub Actions -->
        <div class="glass-panel p-3 rounded-2xl border border-white/10 space-y-2">
          <div class="font-bold text-purple-300 flex items-center gap-1.5">
            <Download class="w-4 h-4" />
            <span>方法 3：GitHub Actions 雲端編譯</span>
          </div>
          <p class="text-[11px] text-slate-400">已內建 <code>.github/workflows/build-ipa.yml</code>，推送到 GitHub 即可由雲端自動打包下載 IPA 檔案。</p>
        </div>
      </div>

      <button
        @click="emit('close')"
        class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-2xl transition-all"
      >
        確定
      </button>
    </div>
  </div>
</template>
