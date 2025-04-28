<script setup>
import { computed } from 'vue';
import Avatar from '../ui/Avatar.vue';

const props = defineProps({
  message: Object,
  userId: String,
  recipient: Object,
});

const isOwnMessage = computed(() => props.message.sender === props.userId);
const messageTime = computed(() => new Date(props.message.updatedAt).toLocaleTimeString());
const isMedia = computed(() => 
  props.message.type === 'gif' || 
  props.message.type === 'image' || 
  props.message.type === 'video' ||
  props.message.message.includes('giphy.com')
);
</script>

<template>
  <div :class="isOwnMessage ? 'flex justify-end' : 'flex justify-start'">
    <div class="self-start" v-if="!isOwnMessage">
      <Avatar :src="recipient.avatar" :alt="`${recipient.firstName}'s avatar`" size="sm" class="h-10 w-10" />
    </div>
    
    <div :class="isOwnMessage ? 'bg-sky-600 mr-2' : 'bg-gray-800 ml-2'" 
         class="flex justify-end rounded-2xl max-w-2xl text-white saturate-200">
         
      <div v-if="isMedia" class="relative">
        <img v-if="message.type === 'gif' || message.message.includes('giphy.com')" 
             :src="message.message" alt="GIF" class="max-w-xs rounded-lg">
        <img v-else-if="message.type === 'image'" 
             :src="message.message" alt="Image" class="max-w-xs rounded-lg">
        <video v-else-if="message.type === 'video'" controls class="max-w-xs rounded-lg">
          <source :src="message.message" type="video/mp4">
        </video>
        <p class="absolute bottom-2 right-0 text-white text-[10px] font-light font-exo px-2 py-1 rounded">
          {{ messageTime }}
        </p>
      </div>
      
      <div v-else class="flex">
        <p class="p-4 tracking-wide text-xl prose max-w-md font-exo">{{ message.message }}</p>
        <p class="self-end text-[10px] font-light font-exo p-2">{{ messageTime }}</p>
      </div>
    </div>
  </div>
</template>