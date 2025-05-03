<script setup>
import { watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

watch(() => props.show, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}, { immediate: true });
</script>

<template>
  <div v-if="show" 
       class="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center"
       @click="closeModal">
    <button @click.stop="closeModal" 
            class="absolute flex items-center justify-center top-4 right-4 text-white bg-purple-500/70 rounded-full p-2 hover:bg-purple-800 cursor-pointer transition-colors">
      <FontAwesomeIcon :icon="faTimes" size="lg" />
    </button>
    
    <div class="max-w-[95vw] max-h-[90vh] overflow-auto" @click.stop>
      <img :src="imageUrl" class="max-w-full max-h-[90vh] object-contain" alt="Image preview">
    </div>
  </div>
</template>

<style scoped>
.fixed {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>