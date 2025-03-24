import 'dotenv/config';

console.log("[BUILD DEBUG] NODE_ENV:", process.env.NODE_ENV);
console.log("[BUILD DEBUG] DEV_API_URL:", process.env.DEV_API_URL);
console.log("[BUILD DEBUG] PROD_API_URL:", process.env.PROD_API_URL);


export default ({ config }) => {
  const isDev = process.env.NODE_ENV === 'development';

  const devEnv = {
    API_URL: process.env.DEV_API_URL,
    SUPABASE_URL: process.env.DEV_SUPABASE_URL,
    SUPABASE_KEY: process.env.DEV_SUPABASE_KEY,
  };

  const prodEnv = {
    API_URL: process.env.PROD_API_URL,
    SUPABASE_URL: process.env.PROD_SUPABASE_URL,
    SUPABASE_KEY: process.env.PROD_SUPABASE_KEY,
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
    extra: {
      ...config.extra,
      ...env,
    },
  };
};