// metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// Storybook pode exportar default ou named, então pega os dois jeitos
const mod = require("@storybook/react-native/metro/withStorybook");
const withStorybook = mod.default ?? mod;

const defaultConfig = getDefaultConfig(__dirname);
const sentryConfig = getSentryExpoConfig(__dirname);

/**
 * Merge “na unha” pra não destruir resolver/transformer
 */
const config = {
  ...defaultConfig,
  ...sentryConfig,
  transformer: {
    ...(defaultConfig.transformer || {}),
    ...(sentryConfig.transformer || {})
  },
  resolver: {
    ...(defaultConfig.resolver || {}),
    ...(sentryConfig.resolver || {}),

    // 👇 prioridade pra browser/module antes do main (evita axios node)
    resolverMainFields: ["react-native", "browser", "module", "main"],

    // 👇 força axios pro build browser (NÃO usar dist/node)
    extraNodeModules: {
      ...((defaultConfig.resolver && defaultConfig.resolver.extraNodeModules) || {}),
      ...((sentryConfig.resolver && sentryConfig.resolver.extraNodeModules) || {}),
      axios: require.resolve("axios/dist/browser/axios.cjs")
    },

    // 👇 se você precisa lidar com .mjs/.cjs no projeto/storybook
    sourceExts: Array.from(
      new Set([...(defaultConfig.resolver?.sourceExts || []), "mjs", "cjs"])
    ),
    assetExts: Array.from(
      new Set([...(defaultConfig.resolver?.assetExts || []), "cjs"])
    )
  }
};

module.exports = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, "./.storybook")
});
