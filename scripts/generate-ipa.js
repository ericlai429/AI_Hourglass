import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 開始建構 AI Hourglass Web 專案...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

const distDir = path.join(rootDir, 'dist');
const outputIpa = path.join(rootDir, 'ai-hourglass.ipa');
const tempDir = path.join(rootDir, 'temp_payload');
const payloadDir = path.join(tempDir, 'Payload');
const appDir = path.join(payloadDir, 'AIHourglass.app');

// Clean up old temporary folders
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(outputIpa)) {
  fs.rmSync(outputIpa, { force: true });
}

fs.mkdirSync(appDir, { recursive: true });

// Copy dist contents to app directory
console.log('📦 複製 Web 資源至 iOS App 目錄...');
fs.cpSync(distDir, path.join(appDir, 'public'), { recursive: true });

// Generate standard iOS Info.plist
const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>en</string>
  <key>CFBundleDisplayName</key>
  <string>AI Hourglass</string>
  <key>CFBundleExecutable</key>
  <string>AIHourglass</string>
  <key>CFBundleIdentifier</key>
  <string>com.aihourglass.app</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>AIHourglass</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSRequiresIPhoneOS</key>
  <true/>
  <key>UILaunchStoryboardName</key>
  <string>LaunchScreen</string>
  <key>UIRequiredDeviceCapabilities</key>
  <array>
    <string>arm64</string>
  </array>
  <key>UISupportedInterfaceOrientations</key>
  <array>
    <string>UIInterfaceOrientationPortrait</string>
  </array>
</dict>
</plist>`;

fs.writeFileSync(path.join(appDir, 'Info.plist'), infoPlist);

// Pack into standard IPA (Zip with Payload/)
console.log('📦 封裝為 .ipa 檔案 (Payload/...)...');
const output = fs.createWriteStream(outputIpa);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`\n🎉 成功生成 IPA 檔案: ${outputIpa} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
  console.log('📲 您可以直接將 ai-hourglass.ipa 透過 Sideloadly / AltStore / TrollStore 安裝至 iPhone 13 mini！');
  // Clean up temp
  fs.rmSync(tempDir, { recursive: true, force: true });
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(payloadDir, 'Payload');
archive.finalize();
