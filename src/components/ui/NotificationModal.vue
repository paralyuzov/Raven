<script setup>
import { onMounted, ref, onUnmounted, watch } from "vue";
import { useContactsStore } from "../../stores/contactsStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import socket from "../../plugins/socket";
import Avatar from "./Avatar.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const contactsStore = useContactsStore();

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      contactsStore.fetchRequestUsernames();
    }
  }
);

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
    emit("close");
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

const declineRequest = async (requestId) => {
  try {
    await contactsStore.declineFriendRequest(requestId);
    emit("close");
  } catch (error) {
    console.error("Error declining friend request:", error);
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-opacity-40 flex justify-end items-start pt-16 pr-4 z-50"
      @click="closeModal"
    >
      <div
        class=" dark:bg-gray-800 rounded-xl shadow-2xl w-80 max-h-[70vh] overflow-hidden transform transition-all"
        @click.stop
      >
        <div
          class="bg-gradient-to-r from-purple-700 to-indigo-600 p-4 text-white flex justify-between items-center"
        >
          <h2
            class="text-lg font-bold font-orbitron tracking-wide flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
              />
            </svg>
            Notifications
          </h2>
          <button
            @click="closeModal"
            class="rounded-full p-1 cursor-pointer"
          >
            <FontAwesomeIcon :icon="faClose" class="text-white text-lg" />
          </button>
        </div>

        <div class="overflow-y-auto max-h-[50vh]">
          <div
            v-if="contactsStore.allFriendRequests.length"
            class="divide-y divide-gray-100 dark:divide-gray-700"
          >
            <div
              v-for="requestId in contactsStore.allFriendRequests"
              :key="requestId"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div class="flex items-start space-x-3">
                <div class="relative">
                  <Avatar
                    :src="
                      contactsStore.requestUsernames.find(
                        (u) => u?.id === requestId
                      )?.avatar || ''
                    "
                    size="md"
                    class="border-2 border-purple-500 shadow-md"
                  />
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-800 dark:text-gray-200">
                    {{
                      contactsStore.requestUsernames.find(
                        (u) => u?.id === requestId
                      )?.firstName || "Loading..."
                    }}
                    {{
                      contactsStore.requestUsernames.find(
                        (u) => u?.id === requestId
                      )?.lastName || ""
                    }}
                  </p>
                  <p class="text-sm text-purple-600 dark:text-purple-400">
                    wants to be your friend
                  </p>

                  <div class="flex mt-3 space-x-2">
                    <button
                      @click="acceptRequest(requestId)"
                      class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-full transition-colors flex-1 cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      @click="declineRequest(requestId)"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full transition-colors flex-1 cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="py-12 px-4 text-center">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">No friend requests</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
              You're all caught up!
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white,
.modal-fade-enter-active .bg-gray-800,
.modal-fade-leave-active .bg-gray-800 {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white,
.modal-fade-enter-from .bg-gray-800,
.modal-fade-leave-to .bg-gray-800 {
  transform: translateX(20px);
}
</style>
