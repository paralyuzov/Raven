<script setup>
import { ref, nextTick, onMounted, onUnmounted, computed, watchEffect } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowCircleDown, faArrowCircleRight, faFaceSmile, faUpload, faFilm } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { useChatSocket } from '../composables/useChatSocket';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import GiphySearch from './ui/GiphySearch.vue';
import socket from '../plugins/socket'

const props = defineProps({
  recipient: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const messageStore = useMessageStore();

const userId = authStore.user.id;
const recipientId = ref(props.recipient._id); 
const messageText = ref('');
const messages = ref([]);
const showEmojiPicker = ref(false);
const inputRef = ref(null);
const showGifPicker = ref(false);
const loadingMessages = ref(true);
const messagesContainer = ref(null);

const { loadingMessages: socketLoadingMessages, sendMessage } = useChatSocket(userId, recipientId.value, messages);

const fetchMessages = async () => {
  try {
    loadingMessages.value = true;
    await messageStore.fetchMessages(userId, recipientId.value);
    messages.value = [...messageStore.messages];
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    loadingMessages.value = false;
    nextTick(() => {
      scrollToBottom(true);
    });
  }
};

const scrollToBottom = (immediate = false) => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: immediate ? 'auto' : 'smooth'
      });
    }
  });
};

onMounted(async () => {
  await fetchMessages();
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
});

onUnmounted(() => {
  socket.off('receive_message'); 
});

watchEffect(() => {
  if (messageText.value === '') {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  }
});

watchEffect(() => {
  if (socketLoadingMessages.value) {
    nextTick(() => {
      scrollToBottom();
    });
  }
});

watchEffect(() => {
  if (messages.value.length && !loadingMessages.value) {
    scrollToBottom();
  }
});

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const toggleGifPicker = () => {
  showGifPicker.value = !showGifPicker.value;
};

const addEmoji = (emoji) => {
  messageText.value += emoji.i;
  showEmojiPicker.value = false;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const sendGifMessage = (gifUrl) => {
  const newMessage = {
    sender: userId,
    recipient: recipientId.value,
    message: gifUrl,
    type: 'gif',
    updatedAt: new Date().toISOString(),
  };

  sendMessage(newMessage);
  messages.value.push(newMessage);
  showGifPicker.value = false;
  scrollToBottom();
};

const sendMessageHandler = () => {
  if (!recipientId.value || !messageText.value) return;

  const newMessage = {
    sender: userId,
    recipient: recipientId.value,
    message: messageText.value,
    updatedAt: new Date().toISOString(),
  };

  sendMessage(newMessage);
  messages.value.push(newMessage);
  messageText.value = '';
  scrollToBottom();
};

</script>

<template>
  <div class="ml-62 min-h-[calc(100vh-4rem)] flex flex-col bg-slate-700">
    <div class="text-center flex justify-center items-center space-x-2 border-b-[1px] bg-slate-800 sticky top-0 z-10">
      <h2 class="py-3 font-orbitron text-white tracking-widest">Chat with {{ props.recipient.firstName }} {{ props.recipient.lastName }}</h2>
      <FontAwesomeIcon :icon="faArrowCircleDown" class="text-purple-700"></FontAwesomeIcon>
    </div>

    <div v-if="loadingMessages" class="flex-1 flex items-center justify-center">
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-16 w-16 border-t-6 border-b-6 border-purple-500"></div>
    </div>
  </div>

    <div ref="messagesContainer" v-else class="flex-1 overflow-y-auto my-10 mx-10 space-y-6 pr-2 pb-20">
      <div v-for="msg in messages" :key="msg._id || msg.timestamp" :class="msg.sender === userId ? 'flex justify-end' : 'flex justify-start'">
        <div class="self-start" v-if="msg.sender !== userId">
          <img src="../assets/photo-1.jpeg" alt="" class="w-14 h-14 object-cover rounded-full border-2">
        </div>
        <div :class="msg.sender === userId ? 'bg-sky-600 mr-2 ' : 'bg-gray-800 ml-2'" class="flex justify-end rounded-2xl max-w-2xl text-white saturate-200">
          <div v-if="msg.type === 'gif' || msg.message.includes('giphy.com')" class="relative">
            <img :src="msg.message" alt="GIF" class="max-w-xs rounded-lg">
            <p class="absolute bottom-2 right-0 text-white text-[10px] font-light font-exo px-2 py-1 rounded">
              {{ new Date(msg.updatedAt).toLocaleTimeString() }}
            </p>
          </div>
          <div v-else class="flex">
            <p class="p-4 tracking-wide text-xl prose max-w-md font-exo">{{ msg.message }}</p>
            <p class="self-end text-[10px] font-light font-exo p-2">{{ new Date(msg.updatedAt).toLocaleTimeString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEmojiPicker" class="absolute bottom-35 left-1/2 transform -translate-x-10/12 z-50">
      <EmojiPicker class="custom-emoji-picker" :hide-group-names="true" :disable-sticky-group-name="true" theme="light"
        :hide-search="true" @select="addEmoji" :auto-emoji="true" :disable-skin-tones="true" />
    </div>

    <div v-if="showGifPicker" class="absolute bottom-35 left-1/2 transform -translate-x-10/12 z-50">
      <GiphySearch @select-gif="sendGifMessage" />
    </div>

    <div class="w-full flex justify-center items-center p-3 pb-5 fixed bottom-20 left-20 z-50">
      <div class="w-full sm:w-[30%] md:w-[50%] lg:w-[40%] flex items-center bg-slate-900 rounded-full">
        <div class="flex justify-center items-center space-x-2 mr-2">
          <FontAwesomeIcon :icon="faFaceSmile" @click="toggleEmojiPicker"
            class="text-purple-700 pl-2 text-xl hover:rotate-12 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110">
          </FontAwesomeIcon>
          <FontAwesomeIcon :icon="faUpload"
            class="text-purple-700 px-1 hover:-translate-y-0.5 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110">
          </FontAwesomeIcon>
          <FontAwesomeIcon :icon="faFilm" @click="toggleGifPicker"
            class="text-purple-700 pl-2 text-xl hover:rotate-12 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110">
          </FontAwesomeIcon>
        </div>

        <input ref="inputRef" type="text" v-model="messageText" placeholder="Type a message..."
          class="w-full px-4 py-2 rounded-full text-normal font-exo text-white focus:outline-none hover:bg-slate-950"
          @keydown.enter="sendMessageHandler" />
        <FontAwesomeIcon :icon="faArrowCircleRight"
          class="text-purple-700 px-2 hover:cursor-pointer hover:scale-110 duration-150" @click="sendMessageHandler">
        </FontAwesomeIcon>
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

.custom-emoji-picker {
  background: #abafb4;
}

.custom-emoji-picker {
  user-select: none;
}
</style>