# ⏳ AI Hourglass & 🔮 Crystal Ball (iPhone 13 mini 專屬 AI 算力時鐘)

專為 **iPhone 13 mini**（5.4 吋緊湊螢幕）精心設計的 AI 算力監控工具。支援 **魔法水晶球藥水 % 數** 與 **雙物理動態沙漏（5小時快速重置 + 每週額度）**，支援常駐心跳監測、閒置停止落沙物理，並可直接導出 iOS `.ipa` 檔案或 PWA 離線安裝。

---

## ✨ 核心特色

1. **🔮 魔法水晶球藥水模式**
   - 炫彩液體 Sine 波浪物理與光暈效果。
   - 氣泡動態升騰，即時顯示當前 5 小時短期額度剩餘百分比與重置倒數。
2. **⏳ 雙沙漏模式 (Dual Hourglass System)**
   - **大沙漏 (Large)**：每週總額度（Weekly Quota）倒數與剩餘量。
   - **小沙漏 (Small)**：5 小時快速重置額度（5-Hour Quota）倒數。
   - **智慧閒置物理**：當額度為 100% 滿額或處於閒置狀態時，**沙粒完全停止下落**；消耗算力時沙子動態細緻滑落堆疊。
3. **💓 常駐心跳與多模型監控**
   - 內建支援 **Gemini 系列**、**Claude / GPT 系列**、**GPT-4.5 / o1** 與 **自訂 API 端點**。
   - 即時計算 5 小時與每週倒數時鐘（精確至分秒）。
4. **📱 iPhone 13 mini 深度適配 & IPA 導出**
   - 緊湊 375x812 版型、頂部瀏海 (Notch) 與底部 Home 條安全區適配。
   - 支援一鍵打包為未簽名 `.ipa`，支援 TrollStore、AltStore、Sideloadly 側載安裝。
   - 支援 iOS Safari「加入主畫面」(PWA) 全螢幕運行。

---

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 本機啟動預覽 (支援手機瀏覽器熱點連線)
```bash
npm run dev
```

### 3. 一鍵打包成 iOS `.ipa` 檔案
```bash
npm run package:ipa
```
執行完成後，將在根目錄產出 `ai-hourglass.ipa`。

---

## 📲 安裝至 iPhone 13 mini 的 3 種方式

1. **iOS Safari PWA 免簽名直裝（推薦最快）**：
   - 用 iPhone 13 mini 的 Safari 打開部署網址。
   - 點擊底部「分享」按鈕 ➔ 選擇「加入主畫面」。
   - 即刻獲得無網址列、支援觸控震動與全螢幕體驗的原生 App。
2. **Sideloadly / AltStore 側載**：
   - 將產生的 `ai-hourglass.ipa` 拖曳至 Sideloadly 或 AltStore 進行 Apple ID 簽名安裝。
3. **TrollStore (巨魔直裝)**：
   - 若為越獄或支援 TrollStore 的 iOS 設備，直接 AirDrop `ai-hourglass.ipa` 點擊安裝即可永久免重新簽名。
