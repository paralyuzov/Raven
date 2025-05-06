<script>
import Registration from '../components/forms/Registration.vue';

export default {
  components: {
    Registration,
  },
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4 py-12">
    <!-- Main container -->
    <div class="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-2xl">
      
      <!-- Left side - branding -->
      <div class="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <!-- Subtle pattern overlay -->
        <div class="absolute inset-0 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="smallGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill="none" stroke="#8B5CF6" stroke-width="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        <!-- Purple accent lighting effect -->
        <div class="absolute top-0 right-0 w-48 h-48 bg-purple-700 rounded-full filter blur-3xl opacity-10"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-700 rounded-full filter blur-3xl opacity-10"></div>
        
        <div class="relative z-10 p-8 lg:p-12 flex flex-col h-full justify-between">
          <!-- Logo and branding -->
          <div class="flex flex-col items-center lg:items-start space-y-6">
            <div class="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-900/20 group">
              <img src="../assets/logo.png" alt="Raven Logo" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
            </div>
            
            <div class="text-center lg:text-left">
              <h2 class="text-4xl lg:text-5xl font-bold text-purple-400 tracking-wide font-orbitron">RAVEN</h2>
              <p class="text-base lg:text-lg font-medium text-slate-400 mt-2">Your private message platform</p>
            </div>
          </div>
          
          <!-- Features list -->
          <div class="hidden lg:block space-y-6 mt-8">
            <p class="flex items-center text-slate-300">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              End-to-end encrypted messaging
            </p>
            <p class="flex items-center text-slate-300">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </span>
              Free unlimited messaging
            </p>
            <p class="flex items-center text-slate-300">
              <span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
              Media sharing & group chats
            </p>
          </div>
          
          <!-- Login link -->
          <div class="text-center lg:text-left mt-8 lg:mt-0">
            <p class="text-slate-400 text-sm">
              Already have an account? 
              <router-link to="/login" class="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Log in here
              </router-link>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Right side - registration form -->
      <div class="w-full lg:w-1/2 bg-gradient-to-b from-slate-900 to-slate-800 border-t lg:border-t-0 lg:border-l border-slate-700 p-6 lg:p-10 flex items-center justify-center">
        <Registration />
      </div>
    </div>
  </div>
</template>
