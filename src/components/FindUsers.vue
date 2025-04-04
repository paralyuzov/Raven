<script setup>
import { ref } from "vue";
import InputField from "./ui/InputField.vue";
import { useContactsStore } from "../stores/contactsStore";
import { defineProps, defineEmits } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";

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

const searchUsers = async () => {
  users.value = await contactStore.findUsers(searchQuery.value);
};

const friendRequest = async (friendId) => {
    await contactStore.sendFriendReuest(friendId);
}

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="show"
    class="absolute top-[49px] left-1 flex justify-center items-center z-50"
  >
    <div class="bg-slate-100 p-6  rounded-lg shadow-lg text-black flex flex-col justy-center items-center">
      <div class="relative self-start min-w-[300px]">
        <InputField
          v-model="searchQuery"
          id="search-users"
          label="Search Contacts"
          placeholder="Search by typing a name..."
          @keydown.enter="searchUsers"
        />
        <FontAwesomeIcon
          :icon="faSearch"
          class="absolute right-3 bottom-1/8 -translate-y-3 text-purple-400 hover:cursor-pointer"
          @click="searchUsers"
        />
      </div>

      <div>
        <ul class="mt-4">
          <div
            v-for="user in users"
            :key="user._id"
            class="p-2 flex justify-start my-2 items-center space-x-2 bg-slate-600 rounded-lg"
          >
            <div>
              <img
                src="../assets/photo-1.jpeg"
                alt=""
                class="w-12 h-12 object-cover rounded-full"
              />
            </div>

            <p class="font-mono text-gray-100 flex-grow">
              {{ user.firstName }} {{ user.lastName }}
            </p>

            <div
              class="w-8 h-8 flex justify-center items-center hover:cursor-pointer hover:scale-120 transition-all ease-in-out duration-500"
             @click="friendRequest(user._id)"
            >
              <FontAwesomeIcon :icon="faUserPlus" class="text-purple-500" />
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
