<script setup>
import { computed, ref } from 'vue';
import Avatar from '../ui/Avatar.vue';
import ImagePreviewModal from '../ui/ImagePreviewModal.vue';

const props = defineProps({
  message: Object,
  userId: String,
  recipient: Object,
});

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const showImagePreview = ref(false);
const previewImageUrl = ref('');

const isOwnMessage = computed(() => props.message.sender === props.userId);
const messageTime = computed(() => new Date(props.message.updatedAt).toLocaleTimeString());
const isMedia = computed(() => 
  props.message.type === 'gif' || 
  props.message.type === 'image' || 
  props.message.type === 'video' ||
  props.message.message?.includes('giphy.com')
);

const mediaSource = computed(() => {
  if (!props.message?.message) return '';

  if (props.message.message.startsWith('http') || !props.message.message.startsWith('/uploads')) {
    return props.message.message;
  }
  
  return `${API_BASE_URL}${props.message.message}`;
});

const openImagePreview = (url) => {
  previewImageUrl.value = url;
  showImagePreview.value = true;
};
</script>

<template>
  <div :class="isOwnMessage ? 'flex justify-end' : 'flex justify-start'" class="group">
    <div class="self-end mb-1" v-if="!isOwnMessage">
      <Avatar :src="recipient.avatar" :alt="`${recipient.firstName}'s avatar`" size="xs" class="h-8 w-8" />
    </div>
    
    <div 
      :class="[
        isOwnMessage 
          ? 'bg-gradient-to-r from-purple-700 to-indigo-800 mr-2 rounded-bl-2xl rounded-tl-2xl rounded-tr-lg' 
          : 'bg-slate-700 ml-2 rounded-br-2xl rounded-tr-2xl rounded-tl-lg',
        isMedia ? 'p-1 overflow-hidden' : 'py-2 px-4'
      ]" 
      class="text-white shadow-lg max-w-md"
    >
      <div v-if="isMedia" class="relative rounded-lg overflow-hidden">
        <img 
          v-if="message.type === 'gif' || message.message?.includes('giphy.com')" 
          :src="mediaSource" 
          alt="GIF" 
          class="max-w-xs rounded-lg cursor-zoom-in"
          @click="openImagePreview(mediaSource)"
        >
        <img 
          v-else-if="message.type === 'image'" 
          :src="mediaSource" 
          alt="Image" 
          class="max-w-xs rounded-lg cursor-zoom-in"
          @click="openImagePreview(mediaSource)"
        >
        <video v-else-if="message.type === 'video'" controls class="max-w-xs rounded-lg">
          <source :src="mediaSource" type="video/mp4">
        </video>
        
        <div class="absolute bottom-2 right-2 bg-black/40 text-white text-xs font-light font-exo px-2 py-1 rounded-full">
          {{ messageTime }}
        </div>
      </div>
      
      <div v-else class="flex flex-col">
        <p class="tracking-wide font-exo">{{ message.message }}</p>
        <span class="text-[14px] font-light self-end mt-1 opacity-75">{{ messageTime }}</span>
      </div>
    </div>
  </div>

  <ImagePreviewModal 
    :show="showImagePreview"
    :imageUrl="previewImageUrl" 
    @close="showImagePreview = false"
  />
</template>

<style scoped>
.cursor-zoom-in {
  cursor: zoom-in;
}
</style>