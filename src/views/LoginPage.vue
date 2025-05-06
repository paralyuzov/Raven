<script>
import Login from '../components/forms/Login.vue';
export default {
    components: {
        Login
    },
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black px-4 py-12">
    <div class="w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-2xl">
    
      <div class="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 lg:p-12">
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
        
        <div class="absolute top-0 right-0 w-48 h-48 bg-purple-700 rounded-full filter blur-3xl opacity-10"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-indigo-700 rounded-full filter blur-3xl opacity-10"></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between items-center">
          <div class="flex flex-col items-center space-y-6 mt-4">
            <div class="relative w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-900/20 group">
              <img src="../assets/logo.png" alt="Raven Logo" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
            </div>
            
            <div class="text-center">
              <h1 class="text-4xl font-bold text-purple-400 tracking-wide font-orbitron">RAVEN</h1>
              <p class="text-base font-medium text-slate-400 mt-2">Welcome back</p>
            </div>
          </div>
          
          <div class="text-center mt-8 pb-4">
            <p class="text-slate-400 text-sm">
              Don't have an account? 
              <router-link to="/" class="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Register here
              </router-link>
            </p>
          </div>
        </div>
      </div>
      
      <div class="w-full lg:w-1/2 bg-gradient-to-b from-slate-900 to-slate-800 border-t lg:border-t-0 lg:border-l border-slate-700 p-6 lg:p-10 flex items-center justify-center">
        <Login />
      </div>
    </div>
  </div>
</template>