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
    <div v-if="loading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-6 border-b-6 border-purple-500"></div>
        </div>
    </div>

    <div v-else ref="messagesContainer" class="flex-1 overflow-y-auto my-10 mx-10 space-y-6 pr-2 pb-20">
        <MessageItem v-for="message in messages" :key="message._id || message.timestamp" :message="message"
            :userId="userId" :recipient="recipient" />
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