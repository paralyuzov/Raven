<script setup>
import { onBeforeMount, reactive, ref, watch, onUnmounted, onMounted } from 'vue';
import { useContactsStore } from '../stores/contactsStore';
import MessageView from './MessageView.vue'; 
import socket from '../plugins/socket';
import { useAuthStore } from '../stores/authStore';
import Avatar from './ui/Avatar.vue';

const contactsStore = useContactsStore();
const users = ref([]);
const selectedUser = ref(null);
const unreadMessages = reactive({});
const authStore = useAuthStore();
const onlineUsers = ref({});

socket.emit("join", authStore.user.id);

onMounted(() => {
  socket.emit("get_unread_messages", authStore.user.id);

  socket.on("unread_messages", (messages) => {
    const messagesBySender = {};
    messages.forEach((msg) => {
      if (!messagesBySender[msg.sender]) {
        messagesBySender[msg.sender] = 0;
      }
      messagesBySender[msg.sender]++;
    });

    Object.keys(messagesBySender).forEach(senderId => {
      if (senderId !== selectedUser.value?._id) {
        unreadMessages[senderId] = messagesBySender[senderId];
      }
    });
  });

  socket.on("receive_message", (message) => {
    const senderId = message.sender;
    if (senderId !== authStore.user.id && selectedUser.value?._id !== senderId) {
      unreadMessages[senderId] = (unreadMessages[senderId] || 0) + 1;
    }
  });

  socket.on("messages_marked_as_seen", ({ senderId }) => {
    unreadMessages[senderId] = 0;
  });

  socket.on("user_status", (users) => {
    onlineUsers.value = users;
  });

  socket.emit("get_online_users");
});

onBeforeMount(async () => {
  await contactsStore.getContacts();
  users.value = contactsStore.contacts;
});

watch(() => contactsStore.contacts, (newContacts) => {
  users.value = newContacts;
}, { deep: true });

const selectContact = (user) => {
  if (selectedUser.value?._id === user._id) return;
  
  selectedUser.value = user;
  unreadMessages[user._id] = 0;

  socket.emit("mark_as_seen", { 
    senderId: user._id, 
    recipientId: authStore.user.id,
    socketId: socket.id 
  });
};

onUnmounted(() => {
  socket.off("receive_message");
  socket.off("unread_messages");
  socket.off("messages_marked_as_seen");
  socket.off("user_status");
});
</script>

<template>
  <div class="bg-gradient-to-b from-slate-800 to-slate-900 fixed top-0 left-0 h-full flex flex-col w-72 border-r border-slate-700 shadow-xl">
    <div class="sticky top-0 z-10 bg-slate-800 shadow-md">
      <div class="flex justify-between items-center px-4 py-3">
        <h2 class="font-bold text-purple-400 tracking-wider font-orbitron text-xl flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          Messages
        </h2>
        <div class="relative">
          <input type="text" placeholder="Search..." class="w-22 focus:w-24 transition-all duration-300 bg-slate-700 text-white text-sm rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400" />
        </div>
      </div>
      
      <div class="flex border-b border-slate-700">
        <button class="flex-1 py-2 text-center text-sm font-medium text-purple-400 border-b-2 border-purple-500">All Contacts</button>
        <button class="flex-1 py-2 text-center text-sm font-medium text-gray-400 hover:text-white">Top Friends</button>
      </div>
    </div>

    <div class="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
      <div 
        v-for="user in users" :key="user._id" 
        class="relative flex items-center space-x-3 space-y-1  px-4 py-3 transition-all duration-200 ease-in-out cursor-pointer"
        :class="[
          selectedUser?._id === user._id 
            ? 'bg-gradient-to-r from-purple-900 to-slate-800 border-l-4 border-purple-500' 
            : 'hover:bg-slate-700/50 border-l-4 border-transparent'
        ]"
        @click="selectContact(user)"
      >
        <div class="relative">
          <Avatar 
            :src="user.avatar" 
            :alt="`${user.firstName}'s avatar`"
            size="sm" 
            class="h-12 w-12 rounded-full"
            :class="selectedUser?._id === user._id ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900' : ''"
          />
          <div 
            class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 transform translate-x-0 translate-y-0"
            :class="onlineUsers[user._id] ? 'bg-green-500' : 'bg-gray-500'"
          ></div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex justify-between">
            <p class="font-medium text-sm truncate" 
               :class="selectedUser?._id === user._id ? 'text-white' : 'text-gray-300'">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <p class="text-xs text-gray-400">12:42</p>
          </div>
          
          <p class="text-xs text-gray-400 truncate mt-1">
            Last message preview...
          </p>
        </div>

        <span 
          v-if="unreadMessages[user._id]" 
          class="absolute bottom-3 animate-pulse right-3 text-xs font-medium text-white min-w-[20px] h-5 bg-purple-600 flex justify-center items-center rounded-full px-1.5"
        >
          {{ unreadMessages[user._id] }}
        </span>
      </div>
      
      <div v-if="users.length === 0" class="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
        <div class="bg-slate-700 rounded-full p-3 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <p class="text-gray-400 font-medium">No contacts yet</p>
        <p class="text-gray-500 text-sm mt-1">Add friends to start messaging!</p>
      </div>
    </div>
  </div>

  <div v-if="selectedUser" class="chat-container">
    <MessageView :key="selectedUser._id" :recipient="selectedUser" />
  </div>
</template>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1F2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4B5563;
  border-radius: 20px;
}
</style>