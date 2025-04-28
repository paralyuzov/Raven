<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';

defineProps({
  recipient: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="text-center flex justify-center items-center space-x-2 border-b-[1px] bg-slate-800 sticky top-0 z-10">
    <h2 class="py-3 font-orbitron text-white tracking-widest">
      Chat with {{ recipient.firstName }} {{ recipient.lastName }}
    </h2>
    <FontAwesomeIcon :icon="faArrowCircleDown" class="text-purple-700"></FontAwesomeIcon>
  </div>
</template>