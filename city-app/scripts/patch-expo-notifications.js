const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../node_modules/expo-notifications/build/TopicSubscriptionModule.android.js');

if (fs.existsSync(targetFile)) {
  const content = fs.readFileSync(targetFile, 'utf8');
  if (content.includes("requireNativeModule('ExpoTopicSubscriptionModule')")) {
    const patched = content.replace(
      /import\s*{\s*requireNativeModule\s*}\s*from\s*['"]expo-modules-core['"];\s*export\s+default\s+requireNativeModule\(['"]ExpoTopicSubscriptionModule['"]\);/g,
      `import { requireOptionalNativeModule } from 'expo-modules-core';\n\nconst module = requireOptionalNativeModule('ExpoTopicSubscriptionModule') ?? {\n  addListener: () => {},\n  removeListeners: () => {},\n  subscribeToTopicAsync: () => Promise.resolve(null),\n  unsubscribeFromTopicAsync: () => Promise.resolve(null),\n};\n\nexport default module;\n`
    );
    fs.writeFileSync(targetFile, patched, 'utf8');
    console.log('[patch-expo-notifications] Successfully patched TopicSubscriptionModule.android.js for Expo Go compatibility.');
  }
}

// Silence noisy Expo Go SDK 53 push notification warnings
const autoRegFile = path.resolve(__dirname, '../node_modules/expo-notifications/build/DevicePushTokenAutoRegistration.fx.js');
if (fs.existsSync(autoRegFile)) {
  let content = fs.readFileSync(autoRegFile, 'utf8');
  if (content.includes("console.warn(\n    '[expo-notifications] Push notifications") || content.includes("console.warn('[expo-notifications] Push notifications")) {
    content = content.replace(
      /console\.warn\(\s*['"]\[expo-notifications\] Push notifications/g,
      "console.debug('[expo-notifications] Push notifications"
    );
    fs.writeFileSync(autoRegFile, content, 'utf8');
    console.log('[patch-expo-notifications] Patched DevicePushTokenAutoRegistration.fx.js (demoted warning to debug).');
  }
}

const indexNotifFile = path.resolve(__dirname, '../node_modules/expo-notifications/build/index.js');
if (fs.existsSync(indexNotifFile)) {
  let content = fs.readFileSync(indexNotifFile, 'utf8');
  if (content.includes('console.warn(message);')) {
    content = content.replace('console.warn(message);', '// console.warn(message);');
    fs.writeFileSync(indexNotifFile, content, 'utf8');
    console.log('[patch-expo-notifications] Patched expo-notifications/build/index.js (suppressed Expo Go warning).');
  }
}

// Patch ws module to expose WebSocketServer if ws v7 is hoisted
const wsTargetFile = path.resolve(__dirname, '../node_modules/ws/index.js');
if (fs.existsSync(wsTargetFile)) {
  const wsContent = fs.readFileSync(wsTargetFile, 'utf8');
  if (!wsContent.includes('WebSocket.WebSocketServer')) {
    const patchedWs = wsContent.replace(
      "WebSocket.Server = require('./lib/websocket-server');",
      "WebSocket.Server = require('./lib/websocket-server');\nWebSocket.WebSocketServer = WebSocket.Server;"
    );
    fs.writeFileSync(wsTargetFile, patchedWs, 'utf8');
    console.log('[patch-expo-notifications] Successfully patched ws/index.js with WebSocketServer alias.');
  }
}

// Ensure expo-modules-core src/ exists
const expoCoreSrc = path.resolve(__dirname, '../node_modules/expo-modules-core/src/index.ts');
if (!fs.existsSync(expoCoreSrc)) {
  const dest = path.resolve(__dirname, '../node_modules/expo-modules-core');
  if (fs.existsSync(dest)) {
    try {
      const https = require('https');
      const { spawn } = require('child_process');
      https.get('https://registry.npmjs.org/expo-modules-core/-/expo-modules-core-57.0.23.tgz', res => {
        const proc = spawn('tar', ['-xzf', '-', '--strip-components=1', 'package/src'], { cwd: dest, stdio: ['pipe', 'inherit', 'inherit'] });
        res.pipe(proc.stdin);
      });
    } catch (_) {}
  }
}

// Ensure expo-router assets exist
const expoRouterAssets = path.resolve(__dirname, '../node_modules/expo-router/assets/file.png');
if (!fs.existsSync(expoRouterAssets)) {
  const dest = path.resolve(__dirname, '../node_modules/expo-router');
  if (fs.existsSync(dest)) {
    try {
      const https = require('https');
      const { spawn } = require('child_process');
      https.get('https://registry.npmjs.org/expo-router/-/expo-router-57.0.28.tgz', res => {
        const proc = spawn('tar', ['-xzf', '-', '--strip-components=1', 'package/assets'], { cwd: dest, stdio: ['pipe', 'inherit', 'inherit'] });
        res.pipe(proc.stdin);
      });
    } catch (_) {}
  }
}

// Ensure @expo/ui jetpack-compose components exist
const expoUiLazyColumn = path.resolve(__dirname, '../node_modules/@expo/ui/src/jetpack-compose/LazyColumn/index.tsx');
if (!fs.existsSync(expoUiLazyColumn)) {
  const dest = path.resolve(__dirname, '../node_modules/@expo/ui');
  if (fs.existsSync(dest)) {
    try {
      const https = require('https');
      const { spawn } = require('child_process');
      https.get('https://registry.npmjs.org/@expo/ui/-/ui-57.0.25.tgz', res => {
        const proc = spawn('tar', ['-xzf', '-', '--strip-components=1', 'package/src'], { cwd: dest, stdio: ['pipe', 'inherit', 'inherit'] });
        res.pipe(proc.stdin);
      });
    } catch (_) {}
  }
}

