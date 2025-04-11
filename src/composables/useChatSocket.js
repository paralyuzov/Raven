import { ref, onMounted, onUnmounted } from 'vue';
import socket from '../plugins/socket';

export function useChatSocket(userId, recipientId, messages) {
  const loadingMessages = ref(true);
  
  onMounted(() => {
    socket.emit('join', userId); 

    socket.on('receive_message', (message) => {
      if (message.recipient === userId && message.sender === recipientId) {
        messages.value.push(message); 
      }
    });

    loadingMessages.value = false;
  });

  onUnmounted(() => {
    socket.off('receive_message');
  });

  const sendMessage = (newMessage) => {
    socket.emit('private_message', newMessage);
  };

  return { loadingMessages, sendMessage };
}