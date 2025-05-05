<script setup>
import { ref, nextTick } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowCircleRight, faFaceSmile, faUpload, faFilm } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'vue3-emoji-picker';
import GiphySearch from '../ui/GiphySearch.vue';
import 'vue3-emoji-picker/css';

const props = defineProps({
  recipientId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['send-message', 'send-media', 'send-gif']);

const messageText = ref('');
const showEmojiPicker = ref(false);
const showGifPicker = ref(false);
const inputRef = ref(null);

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  showGifPicker.value = false;
};

const toggleGifPicker = () => {
  showGifPicker.value = !showGifPicker.value;
  showEmojiPicker.value = false;
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
  emit('send-gif', gifUrl);
  showGifPicker.value = false;
};

const sendMessageHandler = () => {
  if (!messageText.value.trim()) return;
  
  emit('send-message', messageText.value);
  messageText.value = '';
  
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('send-media', file);
  }
};
</script>

<template>
  <div class="relative z-10  bg-slate-800/20 py-4 px-4 max-w-full" >
    <div class=" relative flex items-center mx-auto">
      <div class="flex space-x-3 mr-3">
        <button @click="toggleEmojiPicker" class="p-2 rounded-full hover:bg-purple-700/20 transition-all duration-200">
          <FontAwesomeIcon :icon="faFaceSmile" class="text-purple-400 text-lg" />
        </button>
        
        <label for="file-upload" class="p-2 rounded-full hover:bg-purple-700/20 transition-all duration-200 cursor-pointer">
          <FontAwesomeIcon :icon="faUpload" class="text-purple-400 text-lg" />
        </label>
        <input id="file-upload" type="file" accept="image/*,video/*" class="hidden" @change="handleFileUpload" />
        
        <button @click="toggleGifPicker" class="p-2 rounded-full hover:bg-purple-700/20 transition-all duration-200">
          <FontAwesomeIcon :icon="faFilm" class="text-purple-400 text-lg" />
        </button>
      </div>

      <input 
        ref="inputRef" 
        type="text" 
        v-model="messageText" 
        placeholder="Type a message..." 
        class="flex-1 bg-slate-700 text-white rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-400"
        @keydown.enter="sendMessageHandler"
      />
      
      <button 
        @click="sendMessageHandler"
        :disabled="!messageText.trim()"
        :class="messageText.trim() ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800' : 'bg-slate-600'"
        class="ml-3 rounded-full p-3 text-white transition-all duration-200"
      >
        <FontAwesomeIcon :icon="faArrowCircleRight" class="text-lg" />
      </button>
    </div>

    <div 
      v-if="showEmojiPicker" 
      class="absolute bottom-20 left-0 z-50 shadow-2xl rounded-lg overflow-hidden"
    >
      <EmojiPicker 
        class="custom-emoji-picker" 
        :hide-group-names="true" 
        :disable-sticky-group-name="true" 
        theme="dark"
        :hide-search="false" 
        @select="addEmoji" 
        :auto-emoji="true" 
        :disable-skin-tones="true" 
      />
    </div>

    <div 
      v-if="showGifPicker" 
      class="absolute bottom-20 left-4 z-50 shadow-2xl rounded-lg overflow-hidden"
      @click.outside="showGifPicker = false"
    >
      <GiphySearch @select-gif="sendGifMessage" />
    </div>
  </div>
</template>

<style scoped>
.custom-emoji-picker {
  background: #1f2937;
  user-select: none;
  border-radius: 0.5rem;
}
</style>