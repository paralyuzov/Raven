<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowCircleDown, faCircle, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../ui/Avatar.vue';

defineProps({
  recipient: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="sticky top-0 z-20 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b  shadow-sm backdrop-blur-md">
    <div class="flex items-center justify-between px-5 py-2">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <Avatar 
            :src="recipient.avatar" 
            :alt="`${recipient.firstName}'s avatar`"
            size="sm" 
            class="border-2 border-purple-500/40 shadow-md"
          />
        </div>
        
        <div>
          <h2 class="font-orbitron text-white text-lg tracking-wider">
            {{ recipient.firstName }} {{ recipient.lastName }}
          </h2>
          <div class="flex items-center space-x-1.5 mt-0.5">
            <FontAwesomeIcon :icon="faCircle" class="text-green-500 text-[8px]" />
            <span class="text-xs text-gray-300 font-exo">Active now</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <button class="p-2.5 rounded-full transition-all hover:bg-purple-700/20 text-purple-400 hover:text-purple-300 hover:scale-105">
          <FontAwesomeIcon :icon="faArrowCircleDown" class="text-lg" />
        </button>
        <button class="p-2.5 rounded-full transition-all hover:bg-purple-700/20 text-purple-400 hover:text-purple-300 hover:scale-105">
          <FontAwesomeIcon :icon="faEllipsisVertical" class="text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>