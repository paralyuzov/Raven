<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import MessageItem from './MessageItem.vue';

const props = defineProps({
    messages: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    recipient: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const messagesContainer = ref(null);

const scrollToBottom = (immediate = false) => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        };
    });
};

onMounted(() => {
    scrollToBottom(true);
});

watch(() => props.messages.length, (newLength, oldLength) => {
    if (newLength > oldLength) {
        scrollToBottom();
    }
});

watch(()=> props.loading,(isLoading) => {
    if (!isLoading) {
        scrollToBottom();
    };
});

defineExpose({scrollToBottom});
</script>

<template>
  <div v-if="loading" class="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      <p class="text-purple-300 font-exo text-sm">Loading messages...</p>
    </div>
  </div>

  <div 
    v-else 
    ref="messagesContainer" 
    class="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-slate-800 to-slate-900 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
  >
    <div class="flex justify-center mb-8">
      <div class="px-4 py-1.5 bg-slate-700/50 rounded-full text-xs text-gray-300 font-medium">
        Today
      </div>
    </div>
    
    <MessageItem 
      v-for="message in messages" 
      :key="message._id || message.timestamp" 
      :message="message"
      :userId="userId" 
      :recipient="recipient" 
    />
    
  
  </div>
</template>

<style scoped>
.flex-1 {
    max-height: calc(100vh - 17.4rem);
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