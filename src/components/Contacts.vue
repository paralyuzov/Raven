<script setup>
import { onBeforeMount, reactive, ref, watch, onUnmounted, onMounted } from 'vue';
import { useContactsStore } from '../stores/contactsStore';
import MessageView from './MessageView.vue'; 
import socket from '../plugins/socket';
import { useAuthStore } from '../stores/authStore';

const contactsStore = useContactsStore();
const users = ref([]);
const selectedUser = ref(null);
const unreadMessages = reactive({});
const authStore = useAuthStore();


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
});
</script>

<template>
  <div class="bg-slate-800 fixed top-0 left-0 h-full flex flex-col">
    <div class="w-62">
      <h2 class="border-b-[1px] shadow-2xl font-bold border-black text-purple-800 px-4 py-2 tracking-widest font-orbitron text-2xl">
        Messages
      </h2>

      <div 
        v-for="user in users" :key="user._id" 
        class="relative flex items-center hover:shadow-lg shadow-fuchsia-900 hover:translate-x-2 duration-150 transition-all ease-in-out space-x-3 px-4 py-3 text-white bg-slate-700 rounded-2xl mx-4 my-2 hover:bg-purple-800 cursor-pointer"
        @click="selectContact(user)"
      >
        <div class="absolute top-4 right-0 w-3 h-3 bg-green-400 rounded-full transform translate-x-1 -translate-y-1"></div>
        
        <div>
          <img src="../assets/photo-1.jpeg" alt="" class="h-14 w-14 rounded-full object-fill">
        </div>

        <p class="font-mono tracking-normal text-sm">{{ user.firstName }} {{ user.lastName }}</p>

        <span 
          v-if="unreadMessages[user._id]" 
          class="absolute bottom-2 right-2 text-xs font-mono text-white w-6 h-6 bg-purple-700 flex justify-center items-center rounded-full animate-pulse"
        >
          {{ unreadMessages[user._id] }}
        </span>
      </div>
    </div>
  </div>

  <div v-if="selectedUser" class="chat-container">
    <MessageView :key="selectedUser._id" :recipient="selectedUser" />
  </div>
</template>