import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aihourglass.app',
  appName: 'AI Hourglass',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    scheme: 'AIHourglass',
  },
};

export default config;
