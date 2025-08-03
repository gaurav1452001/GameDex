import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { useSession } from '@clerk/clerk-expo';

const supabaseUrl = "https://somkjlfdywfxdktfxzqk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbWtqbGZkeXdmeGRrdGZ4enFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTIyNjIsImV4cCI6MjA2ODEyODI2Mn0.TJmrsPjS0VXpeJjPuSic2xp_OwIbPm0C48RzZhLHOJY";

const useSupabase=()=>{
   const {session} = useSession();

   return createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    // Get the custom Supabase token from Clerk
    fetch: async (url, options = {}) => {
      // The Clerk `session` object has the getToken() method      
      const clerkToken = await session?.getToken({
        // Pass the name of the JWT template you created in the Clerk Dashboard
        // For this tutorial, you named it 'supabase'
        template: 'supabase',
      })

      // Insert the Clerk Supabase token into the headers
      const headers = new Headers(options?.headers)
      headers.set('Authorization', `Bearer ${clerkToken}`)

      // Call the default fetch
      return fetch(url, {
        ...options,
        headers,
      })
    },
  },
});
}




// AppState.addEventListener('change', (nextAppState) => {
//   if (nextAppState === 'active') {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });
