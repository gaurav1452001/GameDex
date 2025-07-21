import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://somkjlfdywfxdktfxzqk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbWtqbGZkeXdmeGRrdGZ4enFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTIyNjIsImV4cCI6MjA2ODEyODI2Mn0.TJmrsPjS0VXpeJjPuSic2xp_OwIbPm0C48RzZhLHOJY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
