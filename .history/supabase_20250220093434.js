import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { SUPABASE_URL, SUPABASE_KEY } = Constants.expoConfig.extra;

if (__DEV__) {
  console.log('__DEV__:', __DEV__);
  console.log('Using Supabase URL:', SUPABASE_URL);
  console.log('Using Supabase Key:', SUPABASE_KEY ? SUPABASE_KEY : 'Not Set');
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);