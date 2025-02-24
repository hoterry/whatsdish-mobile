import { createClient } from '@supabase/supabase-js';
import { DEV_SUPABASE_URL, DEV_SUPABASE_KEY, PROD_SUPABASE_URL, PROD_SUPABASE_KEY } from 'react-native-dotenv';

// 使用 __DEV__ 判断当前环境是开发还是生产
const supabaseUrl = __DEV__ ? DEV_SUPABASE_URL : PROD_SUPABASE_URL;
const supabaseKey = __DEV__ ? DEV_SUPABASE_KEY : PROD_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
