<script setup>
import { onMounted, ref } from 'vue';
import { useContactsStore } from '../../stores/contactsStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClose } from "@fortawesome/free-solid-svg-icons";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  friendRequests: Array,

});

const emit = defineEmits(['close'])
const contactsStore = useContactsStore();
const usernames = ref([]);

const getUsernamesForRequests = async () => {
  const fetchedUsernames = await Promise.all(
    props.friendRequests.map(async (request) => {
      const username = await contactsStore.fetchUsernameById(request);
      return username;  
    })
  );
  usernames.value = fetchedUsernames; 
};

onMounted(() => {
  if (props.friendRequests.length) {
    getUsernamesForRequests();
  }
});

const acceptRequest = async (id) => {
   await contactsStore.acceptFriendRequest(id);
    emit('close');
};

const declineRequest = (id) => {
  
};

const closeModal = () => {
  emit('close')
}

</script>

<template>
  <div v-if="show" class="fixed top-[49px] right-1  bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-slate-100 p-6 rounded-lg shadow-lg w-80 text-black">
      <div @click="closeModal">
        <FontAwesomeIcon :icon="faClose" class="text-gray-600 absolute top-2 right-2 hover:cursor-pointer" />
      </div>
      <h2 class="text-lg font-bold mb-4 text-start text-purple-800 font-orbitron tracking-widest">Notifications</h2>

      <ul v-if="friendRequests.length">
        <li v-for="(request, index) in friendRequests" :key="request.id" class="flex flex-col justify-between items-center mb-2  bg-zinc-200 opacity-90 p-2 rounded-xl">
            <div class="flex justify-start items-center self-start space-x-2 p-2">
                <div class="">
                    <img src="../../assets/photo-1.jpeg" alt="" class="w-14 h-14 rounded-full object-cover">
                </div>
                <span class="font-semibold text-gray-700">{{ usernames[index]?.firstName || 'Loading...' }} {{ usernames[index]?.lastName || '' }}</span>
            </div>
          
          <div class="flex self-end  space-x-4 text-sm">
            <button @click="acceptRequest(request)" class="text-sky-700 hover:text-sky-900 cursor-pointer">Accept</button>
            <button @click="declineRequest()" class="text-red-700 hover:text-red-900 cursor-pointer">Decline</button>
          </div>
        </li>
      </ul>

      <p v-else class="text-center text-gray-500">No friend requests.</p>

    </div>
  </div>
</template>