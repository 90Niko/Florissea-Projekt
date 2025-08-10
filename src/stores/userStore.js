import { supabase } from '@/services/supabase';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  async function fetchUser() {
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });

  return { user, fetchUser };
});
