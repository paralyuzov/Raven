<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faContactBook } from '@fortawesome/free-solid-svg-icons/faContactBook';
import { faUser,faUsers } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../stores/authStore';
import { ref,watch, onMounted } from 'vue';
import NotificationModal from './ui/NotificationModal.vue';
import FindUsers from './findUsers.vue';
import socket from '../plugins/socket';
import { useRouter } from 'vue-router';

const router = useRouter();
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

const navigateToMessages = () => {
  router.push({ name: 'messages' });
};

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
  <nav class="fixed bottom-0 left-0 w-full bg-slate-800 shadow-lg">
    <div class="flex justify-around py-3">
      <div class="text-white flex space-x-12 items-center ">
          <div class="bg-slate-600 w-16 h-16 flex justify-center items-center rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500">
            <FontAwesomeIcon :icon="faHouse" class="text-2xl" />
          </div>
          <div class="bg-slate-600 w-16 h-16 flex justify-center items-center rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500 " @click="toggleUserSearch">
            <FontAwesomeIcon :icon="faUsers" class="text-2xl" />
          </div>
          <div @click="navigateToMessages" class="bg-slate-600 w-16 h-16 flex justify-center items-center rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500">
            <FontAwesomeIcon :icon="faContactBook" class="text-2xl" />
          </div>
          <div class="bg-slate-600 w-16 h-16 flex justify-center items-center rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500">
            <FontAwesomeIcon :icon="faUser" class="text-2xl" />
          </div>
          <div class="bg-slate-600 w-16 h-16 flex justify-center items-center rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500 relative" @click="toggleModal">
            <div class="relative">
              <FontAwesomeIcon :icon="faBell" class="text-2xl" />
              <span v-if="friendRequests.length" class="absolute w-6 h-6 flex justify-center items-center -top-4 -right-5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {{ friendRequests.length }}
              </span>
            </div>
          </div>
      </div>
    </div>
  </nav>


  
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