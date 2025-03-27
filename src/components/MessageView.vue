<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick, watchEffect } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowCircleDown, faArrowCircleRight, faFaceSmile, faUpload } from '@fortawesome/free-solid-svg-icons';
import socket from "../plugins/socket";
import { useAuthStore } from "../stores/authStore";
import { useMessageStore } from "../stores/messageStore";

const authStore = useAuthStore();
const messageStore = useMessageStore();

const userId = authStore.user.id;
const recipientId = ref("");
const messageText = ref("");
const messages = ref([]);

const messagesContainer = ref(null);

const props = defineProps({
  recipient: {
    type: Object,
    required: true,
  },
});

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

onBeforeMount(async () => {
  recipientId.value = props.recipient._id;
  await messageStore.fetchMessages(userId, recipientId.value);
  messages.value = messageStore.messages;

  socket.emit("join", userId);
  socket.on("receive_message", (message) => {
    messages.value.push(message);
  });
});

onMounted(() => {
  scrollToBottom();
});

onUnmounted(() => {
  socket.off("receive_message");
});

watchEffect(() => {
  if (messages.value.length) {
    scrollToBottom();
  }
});

const sendMessage = () => {
  if (!recipientId.value || !messageText.value) return;

  const newMessage = {
    sender: userId,
    recipient: recipientId.value,
    message: messageText.value,
    updatedAt:new Date().toISOString()
  };

  socket.emit("private_message", newMessage);

  messages.value.push(newMessage);
  messageText.value = "";
};
</script>

<template>
  <div class="ml-62 min-h-[calc(100vh-4rem)] flex flex-col bg-slate-700">
    <div class="text-center flex justify-center items-center space-x-2 border-b-[1px] bg-slate-800 sticky top-0 z-10">
      <h2 class="py-3 font-orbitron text-white tracking-widest">Chat with {{ props.recipient.firstName }} {{ props.recipient.lastName }}</h2>
      <FontAwesomeIcon :icon="faArrowCircleDown" class="text-purple-700"></FontAwesomeIcon>
    </div>

    <div ref="messagesContainer" class="flex-1 overflow-y-auto my-10 mx-10 space-y-6 pr-2 pb-20">
      <div v-for="msg in messages" :key="msg._id || msg.timestamp" :class="msg.sender === userId ? 'flex justify-end' : 'flex justify-start'">
        <div class="self-start" v-if="msg.sender !== userId">
          <img src="../assets/photo-1.jpeg" alt="" class="w-14 h-14 object-cover rounded-full border-2">
        </div>
        <div :class="msg.sender === userId ? 'bg-sky-300 mr-2' : 'bg-slate-300 ml-2'" class="flex justify-end rounded-2xl max-w-2xl">
          <p class="p-4 tracking-wide text-xl prose max-w-md font-exo">{{ msg.message }}</p>
          <p class="self-end text-[10px] font-light font-exo p-2">{{ new Date(msg.updatedAt).toLocaleTimeString() }}</p>
        </div>
      </div>
    </div>

    <div class="w-full flex justify-center items-center p-3 pb-5 fixed bottom-20 left-20 z-50">
      <div class="w-full sm:w-[30%] md:w-[50%] lg:w-[40%] flex items-center bg-slate-900 rounded-full">
        <div class="flex space-x-2">
          <FontAwesomeIcon :icon="faFaceSmile" class="text-purple-700 pl-2 text-xl hover:rotate-12 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110"></FontAwesomeIcon>
          <FontAwesomeIcon :icon="faUpload" class="text-purple-700 px-1 hover:-translate-y-0.5 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110"></FontAwesomeIcon>
        </div>

        <input
          type="text"
          v-model="messageText"
          placeholder="Type a message..."
          class="w-full px-4 py-2 rounded-full text-normal font-exo text-white focus:outline-none hover:bg-slate-950"
          @keydown.enter="sendMessage"
        />
        <FontAwesomeIcon :icon="faArrowCircleRight" class="text-purple-700 px-2 hover:cursor-pointer hover:scale-110 duration-150" @click="sendMessage"></FontAwesomeIcon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-1 {
  max-height: calc(100vh - 14rem);
  overflow-y: auto; 
}

.flex-1::-webkit-scrollbar {
  display: none; 
}
.flex-1 {
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

</style>