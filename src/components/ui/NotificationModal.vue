<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { useContactsStore } from '../../stores/contactsStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClose } from "@fortawesome/free-solid-svg-icons";
import socket from '../../plugins/socket';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
const contactsStore = useContactsStore();

watch(() => props.show, (newValue) => {
  if (newValue) {
    contactsStore.fetchRequestUsernames();
  }
});

onMounted(() => {
  socket.on("friend_request_received", (request) => {
    contactsStore.addPendingRequest(request);
  });
});

onUnmounted(() => {
  socket.off("friend_request_received");
});

const acceptRequest = async (requestId) => {
  try {
    await contactsStore.acceptFriendRequest(requestId);
    emit('close');
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};

const declineRequest = async (requestId) => {
  try {
    await contactsStore.declineFriendRequest(requestId);
    emit('close');
  } catch (error) {
    console.error('Error declining friend request:', error);
  }
};

const closeModal = () => {
  emit('close');
};

</script>

<template>
  <div v-if="show" class="fixed top-[49px] right-1  bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-slate-100 p-6 rounded-lg shadow-lg w-80 text-black">
      <div @click="closeModal">
        <FontAwesomeIcon :icon="faClose" class="text-gray-600 absolute top-2 right-2 hover:cursor-pointer" />
      </div>
      <h2 class="text-lg font-bold mb-4 text-start text-purple-800 font-orbitron tracking-widest">Notifications</h2>

      <ul v-if="contactsStore.allFriendRequests.length">
        <li v-for="requestId in contactsStore.allFriendRequests" 
            :key="requestId" 
            class="flex flex-col justify-between items-center mb-2  bg-zinc-200 opacity-90 p-2 rounded-xl">
            <div class="flex justify-start items-center self-start space-x-2 p-2">
                <div class="">
                    <img src="../../assets/photo-1.jpeg" alt="" class="w-14 h-14 rounded-full object-cover">
                </div>
                <span class="font-semibold text-gray-700">
                  {{ contactsStore.requestUsernames.find(u => u?.id === requestId)?.firstName || 'Loading...' }}
                  {{ contactsStore.requestUsernames.find(u => u?.id === requestId)?.lastName || '' }}
                </span>
            </div>
          
          <div class="flex self-end  space-x-4 text-sm">
            <button @click="acceptRequest(requestId)" class="text-sky-700 hover:text-sky-900 cursor-pointer">Accept</button>
            <button @click="declineRequest(requestId)" class="text-red-700 hover:text-red-900 cursor-pointer">Decline</button>
          </div>
        </li>
      </ul>

      <p v-else class="text-center text-gray-500">No friend requests.</p>

    </div>
  </div>
</template>