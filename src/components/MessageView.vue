<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { useChatSocket } from '../composables/useChatSocket';
import socket from '../plugins/socket';
import MessageHeader from './messaging/MessageHeader.vue';
import MessageList from './messaging/MessageList.vue';
import MessageInput from './messaging/MessageInput.vue';

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
const messages = ref([]);
const loadingMessages = ref(true);
const messageListRef = ref(null);

const { sendMessage } = useChatSocket(userId, recipientId.value, messages);

const fetchMessages = async () => {
  try {
    loadingMessages.value = true;
    await messageStore.fetchMessages(userId, recipientId.value);
    messages.value = [...messageStore.messages];
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    loadingMessages.value = false;
  }
};


onMounted(async () => {
  await fetchMessages();

  setTimeout(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollToBottom(true);
    }
  }, 100);
});

onUnmounted(() => {
  socket.off('receive_message');
});

const handleSendMessage = (text) => {
  const newMessage = {
    sender: userId,
    recipient: recipientId.value,
    message: text,
    type: 'text',
    updatedAt: new Date().toISOString(),
  };

  sendMessage(newMessage);
  messages.value.push(newMessage);

  setTimeout(() => messageListRef.value?.scrollToBottom(), 100);
};

const handleSendGif = (gifUrl) => {
  const newMessage = {
    sender: userId,
    recipient: recipientId.value,
    message: gifUrl,
    type: 'gif',
    updatedAt: new Date().toISOString(),
  };

  sendMessage(newMessage);
  messages.value.push(newMessage);

  setTimeout(() => messageListRef.value?.scrollToBottom(), 100);
};

const handleSendMedia = async (file) => {
  try {
    const loadingMessage = {
      sender: userId,
      recipient: recipientId.value,
      message: "Uploading media...",
      type: 'text',
      isLoading: true,
      tempId: Date.now(),
      updatedAt: new Date().toISOString(),
    };
    
    messages.value.push(loadingMessage);
    const result = await messageStore.uploadMedia(file);
    
    messages.value = messages.value.filter(m => !m.isLoading);

    const newMessage = {
      sender: userId,
      recipient: recipientId.value,
      message: result.mediaUrl,
      type: result.type,
      updatedAt: new Date().toISOString(),
    };
    
    sendMessage(newMessage);
    messages.value.push(newMessage);
    
    setTimeout(() => messageListRef.value?.scrollToBottom(), 100);
  } catch (error) {
    console.error('Error uploading media:', error);
    messages.value = messages.value.filter(m => !m.isLoading);
  }
};
</script>

<template>
  <div class="ml-72 min-h-[calc(100vh-7rem)] flex flex-col bg-slate-900">
    <MessageHeader :recipient="props.recipient" />

    <MessageList ref="messageListRef" :messages="messages" :userId="userId" :recipient="props.recipient"
      :loading="loadingMessages" />

    <MessageInput :recipientId="recipientId" :userId="userId" @send-message="handleSendMessage"
      @send-gif="handleSendGif" @send-media="handleSendMedia" />
  </div>
</template>
