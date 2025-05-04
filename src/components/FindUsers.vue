<script setup>
import { ref } from "vue";
import InputField from "./ui/InputField.vue";
import { useContactsStore } from "../stores/contactsStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus, faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import Avatar from "./ui/Avatar.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const contactStore = useContactsStore();
const users = ref([]);
const searchQuery = ref("");
const requestSent = ref(new Set());
const isSearching = ref(false);

const searchUsers = async () => {
  try {
    if (!searchQuery.value.trim()) {
      return;
    }
    isSearching.value = true;
    users.value = await contactStore.findUsers(searchQuery.value);
    console.log(users.value);
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    isSearching.value = false;
  }
};

const friendRequest = async (friendId) => {
  try {
    await contactStore.sendFriendRequest(friendId);
    requestSent.value.add(friendId);
    setTimeout(() => {
      requestSent.value.delete(friendId);
    }, 3000);
  } catch (error) {
    console.error('Friend request error:', error);
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 bg-slate-800 bg-opacity-40 flex items-start justify-center pt-20 z-50" @click="closeModal">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden" @click.stop>
        <div class="bg-gradient-to-r from-purple-700 to-indigo-600 p-4 text-white flex justify-between items-center">
          <h2 class="text-lg font-bold font-orbitron tracking-wide flex items-center">
            <FontAwesomeIcon :icon="faSearch" class="mr-2" />
            Find Friends
          </h2>
          <button @click="closeModal" class="rounded-full p-1 cursor-pointer">
            <FontAwesomeIcon :icon="faClose" class="text-white text-lg" />
          </button>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              @keyup.enter="searchUsers"
              type="text" 
              placeholder="Search by name..." 
              class="w-full pl-4 pr-10 py-2.5 rounded-full border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
            />
            <button 
              @click="searchUsers"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <FontAwesomeIcon :icon="faSearch" />
            </button>
          </div>
        </div>

        <div class="overflow-y-auto max-h-[60vh] p-2">
          <div v-if="isSearching" class="flex justify-center items-center py-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>

          <div v-else-if="users.length" class="divide-y divide-gray-100 dark:divide-gray-700">
            <div 
              v-for="user in users" 
              :key="user._id"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg flex items-center space-x-3"
            >
              <div>
                <Avatar 
                  :src="user.avatar"
                  :alt="`${user.firstName}'s avatar`"
                  size="md"
                  class="border-2 border-purple-400 shadow-md"
                />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ user.firstName }} {{ user.lastName }}
                </p>
              </div>
              <button 
                @click="friendRequest(user._id)" 
                :disabled="requestSent.has(user._id)"
                :class="[
                  'rounded-full p-2 transition-all duration-300',
                  requestSent.has(user._id) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 cursor-pointer'
                ]"
              >
                <FontAwesomeIcon :icon="requestSent.has(user._id) ? faCheck : faUserPlus" />
              </button>
            </div>
          </div>

          <div v-else-if="searchQuery && !isSearching" class="py-12 px-4 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">No users found</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search</p>
          </div>

          <div v-else class="py-12 px-4 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">Search for people</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Find friends by searching their name</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
