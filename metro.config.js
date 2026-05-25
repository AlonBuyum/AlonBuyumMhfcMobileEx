const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Block native build/cache folders so Metro's file watcher doesn't trip on
 * AGP's resource-merge intermediate files (paths with `?` chars on Windows).
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Cap concurrent transformer workers so the OS doesn't SIGTERM them under
  // memory pressure (which manifested as a Swipeable.tsx transform failure).
  maxWorkers: 2,
  resolver: {
    blockList: [
      /[/\\]android[/\\]build[/\\].*/,
      /[/\\]android[/\\]app[/\\]build[/\\].*/,
      /[/\\]android[/\\]\.gradle[/\\].*/,
      /[/\\]ios[/\\]build[/\\].*/,
      /[/\\]ios[/\\]Pods[/\\].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
