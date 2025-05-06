
<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { ref } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
});

const router = useRouter();
const authStore = useAuthStore();
const isLoggingOut = ref(false);

const logout = async () => {
  isLoggingOut.value = true;
  try {
    await authStore.logoutUser();
    router.push('/login');
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>

<template>
  <button 
    v-if="variant === 'default'"
    @click="logout" 
    class="flex items-center px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-colors"
    :disabled="isLoggingOut"
  >
    <svg v-if="isLoggingOut" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
    <span>{{ isLoggingOut ? 'Logging out...' : 'Logout' }}</span>
  </button>
  
  <button 
    v-else-if="variant === 'minimal'" 
    @click="logout" 
    class="text-slate-300 hover:text-white transition-colors"
    :disabled="isLoggingOut"
  >
    {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
  </button>
  
  <button 
    v-else 
    @click="logout" 
    class="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
    :disabled="isLoggingOut"
    aria-label="Logout"
  >
    <svg v-if="isLoggingOut" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  </button>
</template>