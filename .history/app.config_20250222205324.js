import * as Constants from 'expo-constants';

export default ({ config }) => {
  const isDev = Constants.manifest.releaseChannel === 'default'; // 這個會幫助你判斷是否為開發模式

  const devEnv = {
    API_URL: 'http://10.0.0.7:5000', // 開發環境 API
    SUPABASE_URL: 'https://dev.supabase.io',
    SUPABASE_KEY: 'dev-key',
  };

  const prodEnv = {
    API_URL: 'https://prod-api.com', // 生產環境 API
    SUPABASE_URL: 'https://prod.supabase.io',
    SUPABASE_KEY: 'prod-key',
  };

  const env = isDev ? devEnv : prodEnv;

  return {
    ...config,
    extra: {
      ...config.extra,
      ...env,
    },
  };
};
