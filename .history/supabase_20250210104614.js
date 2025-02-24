import { createClient } from '@supabase/supabase-js';
import { DEV_SUPABASE_URL, DEV_SUPABASE_KEY, PROD_SUPABASE_URL, PROD_SUPABASE_KEY } from 'react-native-dotenv';

const supabaseUrl = __DEV__ ? DEV_SUPABASE_URL : PROD_SUPABASE_URL;
const supabaseKey = __DEV__ ? DEV_SUPABASE_KEY : PROD_SUPABASE_KEY;

console.log('__DEV__:', __DEV__);
console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Key:', supabaseKey ? '****' : 'Not Set');

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
