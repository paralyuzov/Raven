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
  <div class="w-full flex justify-center items-center p-3 pb-5 fixed bottom-20 left-20 z-40">
    <div class="w-full sm:w-[30%] md:w-[50%] lg:w-[40%] flex items-center bg-slate-900 rounded-full">
      <div class="flex justify-center items-center space-x-2 mr-2">
        <FontAwesomeIcon :icon="faFaceSmile" @click="toggleEmojiPicker"
          class="text-purple-700 pl-2 text-xl hover:rotate-12 duration-150 transition-all ease-in-out cursor-pointer hover:scale-110">
        </FontAwesomeIcon>
        
        <label for="file-upload" class="cursor-pointer">
          <FontAwesomeIcon :icon="faUpload"
            class="text-purple-700 px-1 hover:-translate-y-0.5 duration-150 transition-all ease-in-out hover:scale-110">
          </FontAwesomeIcon>
        </label>
        <input id="file-upload" type="file" accept="image/*,video/*" class="hidden" @change="handleFileUpload" />
        
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

  <div v-if="showEmojiPicker" class="absolute bottom-35 left-1/2 transform -translate-x-10/12 z-50">
    <EmojiPicker class="custom-emoji-picker" :hide-group-names="true" :disable-sticky-group-name="true" theme="light"
      :hide-search="true" @select="addEmoji" :auto-emoji="true" :disable-skin-tones="true" />
  </div>

  <div v-if="showGifPicker" class="absolute bottom-35 left-1/2 transform -translate-x-10/12 z-50">
    <GiphySearch @select-gif="sendGifMessage" />
  </div>
</template>

<style scoped>
.custom-emoji-picker {
  background: #abafb4;
  user-select: none;
}
</style>