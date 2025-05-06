<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faContactBook } from '@fortawesome/free-solid-svg-icons/faContactBook';
import { faUser,faUsers } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../stores/authStore';
import { ref,watch, onMounted } from 'vue';
import NotificationModal from './ui/NotificationModal.vue';
import FindUsers from './FindUsers.vue';
import socket from '../plugins/socket';

const authStore = useAuthStore();
const friendRequests = ref( authStore.user?.friendRequests || []);
const showModal = ref(false);
const showUserSearchModal = ref(false);
const toggleModal = () => {
  showModal.value = !showModal.value;
};

const toggleUserSearch = () => {
  showUserSearchModal.value = !showUserSearchModal.value;
}

onMounted(() => {
  socket.on("friend_request_received", (request) => {
    if (!friendRequests.value.includes(request.id)) {
      friendRequests.value.push(request.id);
    }
  });
});

watch(
  () => authStore.user?.friendRequests,
  (newFriendRequests) => {
    if (newFriendRequests) {
      friendRequests.value = newFriendRequests;
    }
  },
  { immediate: true, deep: true }
);

</script>

<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto px-5 py-3 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md">
    <div class="flex items-center justify-center space-x-3 sm:space-x-3">
      <router-link to="/" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" 
          class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px]"
          :class="isActive ? 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-lg shadow-purple-700/30 hover:shadow-xl hover:shadow-purple-700/40' : 'text-gray-400 hover:text-white hover:bg-slate-700/50'"
        >
          <div class="relative flex items-center justify-center h-10 w-10 rounded-full transition-transform"
               :class="isActive ? 'scale-110' : 'hover:scale-110'">
            <FontAwesomeIcon :icon="faHouse" class="text-xl sm:text-2xl" />
          </div>
          <span class="text-[10px] mt-1 font-medium tracking-wide">Home</span>
        </button>
      </router-link>
      
      <button @click="toggleUserSearch" 
        class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px] text-gray-400 hover:text-white hover:bg-slate-700/50">
        <div class="relative flex items-center justify-center h-10 w-10 rounded-full transition-transform hover:scale-110">
          <FontAwesomeIcon :icon="faUsers" class="text-xl sm:text-2xl" />
        </div>
        <span class="text-[10px] mt-1 font-medium tracking-wide">Find</span>
      </button>
      
      <router-link to="/messages" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" 
          class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px]"
          :class="isActive ? 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-lg shadow-purple-700/30 hover:shadow-xl hover:shadow-purple-700/40' : 'text-gray-400 hover:text-white hover:bg-slate-700/50'"
        >
          <div class="relative flex items-center justify-center h-10 w-10 rounded-full transition-transform"
               :class="isActive ? 'scale-110' : 'hover:scale-110'">
            <FontAwesomeIcon :icon="faContactBook" class="text-xl sm:text-2xl" />
          </div>
          <span class="text-[10px] mt-1 font-medium tracking-wide">Messages</span>
        </button>
      </router-link>
      
      <router-link to="/profile" custom v-slot="{ isActive, navigate }">
        <button @click="navigate" 
          class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px]"
          :class="isActive ? 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-lg shadow-purple-700/30 hover:shadow-xl hover:shadow-purple-700/40' : 'text-gray-400 hover:text-white hover:bg-slate-700/50'"
        >
          <div class="relative flex items-center justify-center h-10 w-10 rounded-full transition-transform"
               :class="isActive ? 'scale-110' : 'hover:scale-110'">
            <FontAwesomeIcon :icon="faUser" class="text-xl sm:text-2xl" />
          </div>
          <span class="text-[10px] mt-1 font-medium tracking-wide">Profile</span>
        </button>
      </router-link>
      
      <button @click="toggleModal" 
        class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[64px] text-gray-400 hover:text-white hover:bg-slate-700/50">
        <div class="relative flex items-center justify-center h-10 w-10 rounded-full transition-transform hover:scale-110">
          <FontAwesomeIcon :icon="faBell" class="text-xl sm:text-2xl" />
          <span v-if="friendRequests.length" 
                class="absolute -top-2 -right-2 w-5 h-5 flex justify-center items-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30 animate-pulse">
            {{ friendRequests.length }}
          </span>
        </div>
        <span class="text-[10px] mt-1 font-medium tracking-wide">Alerts</span>
      </button>
    </div>
  </nav>

  <div class="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
  
  <NotificationModal
    :show="showModal" 
    :friendRequests="friendRequests" 
    @close="toggleModal"
  />

  <FindUsers
    :show="showUserSearchModal" 
    @close="toggleUserSearch"
  />
</template>

