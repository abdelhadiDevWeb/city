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
