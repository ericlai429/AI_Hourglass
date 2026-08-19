<script setup lang="ts">
import { ref } from 'vue';
import { userAccounts, currentAccountEmail, switchAccount, addAccount, maskEmail, isEmailRevealed, toggleEmailReveal } from '../stores/quotaStore';
import FaceIdModal from './FaceIdModal.vue';
import { User, ChevronDown, Check, Plus, ShieldCheck, ScanFace, Eye, EyeOff } from 'lucide-vue-next';

const isOpen = ref(false);
const newEmail = ref('');
const showAddInput = ref(false);

const isFaceIdOpen = ref(false);
const pendingEmail = ref('');

const handleSelect = (email: string) => {
  if (email === currentAccountEmail.value) {
    isOpen.value = false;
    return;
  }
  pendingEmail.value = email;
  isOpen.value = false;
  isFaceIdOpen.value = true;
};

const handleFaceIdSuccess = (email: string) => {
  switchAccount(email);
  isFaceIdOpen.value = false;
};

const handleAddNew = () => {
  if (newEmail.value.trim()) {
    const email = newEmail.value.trim();
    addAccount(email);
    newEmail.value = '';
    showAddInput.value = false;
    isOpen.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="glass-pill px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-all active:scale-95 border border-white/10"
    >
      <div
        class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase shrink-0"
        :class="currentAccountEmail.includes('oocai') ? 'bg-blue-600' : 'bg-purple-600'"
      >
        {{ currentAccountEmail.charAt(0) }}
      </div>
      
      <!-- Privacy Masked Email -->
      <span class="font-mono text-[11px] max-w-[115px] truncate">
        {{ maskEmail(currentAccountEmail) }}
      </span>

      <ScanFace class="w-3 h-3 text-emerald-400 shrink-0" />
      <ChevronDown class="w-3 h-3 text-slate-400 shrink-0" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>

    <div
      v-if="isOpen"
      class="absolute left-0 mt-2 w-64 z-50 glass-panel rounded-2xl p-2.5 shadow-2xl border border-white/15 space-y-1.5 backdrop-blur-xl"
    >
      <div class="text-[10px] font-semibold text-slate-400 px-2 py-0.5 flex items-center justify-between">
        <span class="flex items-center gap-1">
          <ScanFace class="w-3.5 h-3.5 text-emerald-400" />
          <span>Face ID 登入帳號</span>
        </span>
        
        <!-- Toggle Reveal Eye Button -->
        <button
          @click.stop="toggleEmailReveal"
          class="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-all"
          :title="isEmailRevealed ? '隱藏完整信箱' : '顯示完整信箱'"
        >
          <component :is="isEmailRevealed ? EyeOff : Eye" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Account List -->
      <button
        v-for="acc in userAccounts"
        :key="acc.email"
        @click="handleSelect(acc.email)"
        class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all text-xs"
        :class="currentAccountEmail === acc.email
          ? 'bg-blue-600/25 border border-blue-500/40 text-white'
          : 'hover:bg-white/5 text-slate-300'"
      >
        <div class="flex items-center gap-2 truncate">
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            :class="acc.email.includes('oocai') ? 'bg-blue-600' : 'bg-purple-600'"
          >
            {{ acc.email.charAt(0).toUpperCase() }}
          </div>
          <div class="truncate">
            <div class="text-[11px] font-mono font-medium truncate">
              {{ maskEmail(acc.email) }}
            </div>
            <div class="text-[9px] text-slate-400 flex items-center gap-1">
              <span>{{ acc.name }}</span>
              <span class="text-emerald-400 text-[8px] font-mono">● FaceID</span>
            </div>
          </div>
        </div>
        <Check v-if="currentAccountEmail === acc.email" class="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />
      </button>

      <!-- Add New Account Form -->
      <div class="border-t border-white/10 pt-1.5 mt-1">
        <div v-if="!showAddInput">
          <button
            @click="showAddInput = true"
            class="w-full flex items-center justify-center gap-1 py-1 text-[11px] text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <Plus class="w-3 h-3" />
            <span>新增其他信箱帳號</span>
          </button>
        </div>
        <div v-else class="space-y-1.5 p-1">
          <input
            type="email"
            v-model="newEmail"
            placeholder="輸入新信箱 address@gmail.com"
            class="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            @keyup.enter="handleAddNew"
          />
          <div class="flex gap-1">
            <button
              @click="handleAddNew"
              class="flex-1 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-medium"
            >
              確認綁定
            </button>
            <button
              @click="showAddInput = false"
              class="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px]"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Face ID Verification Modal -->
    <FaceIdModal
      :isOpen="isFaceIdOpen"
      :targetEmail="pendingEmail"
      @success="handleFaceIdSuccess"
      @cancel="isFaceIdOpen = false"
    />
  </div>
</template>
