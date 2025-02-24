import * as Constants from 'expo-constants';
import 'dotenv/config'; // 加载 .env 文件

export default ({ config }) => {
  // 判断环境
  const isDev =
    Constants.manifest.releaseChannel === null ||
    Constants.manifest.releaseChannel === undefined ||
    Constants.manifest.releaseChannel === 'default';

  // 从 .env 文件中读取敏感信息
  const devEnv = {
    API_URL: process.env.API_URL_DEV || 'http://10.0.0.7:5000', // 默认值
    SUPABASE_URL: process.env.SUPABASE_URL_DEV,
    SUPABASE_KEY: process.env.SUPABASE_KEY_DEV,
  };

  const prodEnv = {
    API_URL: process.env.API_URL_PROD || 'https://prod-api.com', // 默认值
    SUPABASE_URL: process.env.SUPABASE_URL_PROD,
    SUPABASE_KEY: process.env.SUPABASE_KEY_PROD,
  };

  // 根据环境选择配置
  const env = isDev ? devEnv : prodEnv;

  return {
    ...config, // 保留默认配置
    extra: {
      ...config.extra, // 保留原有的 extra 配置
      ...env, // 注入环境变量
    },
  };
};