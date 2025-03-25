import 'dotenv/config';

console.log("[BUILD DEBUG] NODE_ENV:", process.env.NODE_ENV);
console.log("[BUILD DEBUG] DEV_API_URL:", process.env.DEV_API_URL);
console.log("[BUILD DEBUG] PROD_API_URL:", process.env.PROD_API_URL);

export default ({ config }) => {
  const isDev = process.env.NODE_ENV === 'development';

  const devEnv = {
    API_URL: process.env.DEV_API_URL || "https://fallback.dev.api.whatsdish.com",
    SUPABASE_URL: process.env.DEV_SUPABASE_URL || "https://fallback.dev.supabase.co",
    SUPABASE_KEY: process.env.DEV_SUPABASE_KEY || "fallback_dev_key",
  };

  const prodEnv = {
    API_URL: process.env.PROD_API_URL || "https://fallback.api.whatsdish.com",
    SUPABASE_URL: process.env.PROD_SUPABASE_URL || "https://fallback.supabase.co",
    SUPABASE_KEY: process.env.PROD_SUPABASE_KEY || "fallback_prod_key",
  };

  const env = isDev ? devEnv : prodEnv;

  return {
    ...config,
    android: {
      ...config.android,
      package: "com.whatsdish.app",
    },
    ios: {
      ...config.ios,
      bundleIdentifier: "com.whatsdish.app",
    },
    plugins: [
      ...(config.plugins || []),
      "sentry-expo" 
    ],
    extra: {
      ...config.extra,
      ...env,
      sentryDsn: "https://522658a6daf31f71aba6d144c11aebf4@o4509035612078080.ingest.us.sentry.io/4509035617714176"
    },
  };
};
