import * as Constants from 'expo-constants';

export default ({ config }) => {
  const isDev = Constants.manifest.releaseChannel === 'default'; // 這個會幫助你判斷是否為開發模式

  const devEnv = {
    API_URL: 'http://10.0.0.7:5000', 
    SUPABASE_URL: 'https://kaogouzfrzjeynyflmrr.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb2dvdXpmcnpqZXlueWZsbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjUyNzQsImV4cCI6MjA0OTI0MTI3NH0.Bp75Wx3ZruXhkw6W8vh6J3FtjFyy4QSY3t8_aaGyG90',
  };

  const prodEnv = {
    API_URL: 'https://prod-api.com', 
    SUPABASE_URL: 'https://kaogouzfrzjeynyflmrr.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb2dvdXpmcnpqZXlueWZsbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjUyNzQsImV4cCI6MjA0OTI0MTI3NH0.Bp75Wx3ZruXhkw6W8vh6J3FtjFyy4QSY3t8_aaGyG90',
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
