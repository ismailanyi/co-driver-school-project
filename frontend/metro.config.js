const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Allow Metro to resolve ESM packages (e.g. @supabase/supabase-js) that use
// import.meta by honouring the "exports" field in package.json. Without this,
// Metro picks the CJS fallback bundle which still contains the import.meta
// syntax and crashes the web build.
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: './global.css' });
