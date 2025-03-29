<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useContactsStore } from '../stores/contactsStore';
import MessageView from './MessageView.vue';  

const contactsStore = useContactsStore();
const users = ref([]);
const selectedUser = ref(null);

onBeforeMount(async () => {
  await contactsStore.getContacts();
  users.value = contactsStore.contacts

});

watch(() => contactsStore.contacts, (newContacts) => {
  users.value = newContacts;
}, { deep: true });


const selectContact = (user) => {
  selectedUser.value = user; 
};
</script>

<template>
  <div class="bg-slate-800 fixed top-0 left-0 h-full flex flex-col">
    <div class="w-62">
      <h2 class="border-b-[1px] shadow-2xl font-bold border-black text-purple-800 px-4 py-2 tracking-widest font-orbitron text-2xl">Messages</h2>

      <div v-for="user in users" :key="user.id" class="relative flex items-center hover:shadow-lg shadow-fuchsia-900 hover:translate-x-2 duration-150 transition-all ease-in-out space-x-3 px-4 py-3 text-white bg-slate-700 rounded-2xl mx-4 my-2 hover:bg-purple-800 cursor-pointer" @click="selectContact(user)">
        <div class="absolute top-4 right-0 w-3 h-3 bg-green-400 rounded-full transform translate-x-1 -translate-y-1"></div>
        <div>
          <img src="../assets/photo-1.jpeg" alt="" class="h-14 w-14 rounded-full object-fill">
        </div>
        <p class="font-mono tracking-normal text-sm">{{ user.firstName }} {{ user.lastName }}</p>
      </div>
    </div>
  </div>

  <div v-if="selectedUser" class="chat-container">
    <MessageView :key="selectedUser._id" :recipient="selectedUser" />
  </div>
</template>