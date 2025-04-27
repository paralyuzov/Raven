<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'User avatar'
  },
  size: {
    type: String,
    default: 'md' 
  }
});

const hasError = ref(false);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const avatarUrl = computed(() => {

  if (hasError.value || !props.src) {
    return '/assets/default-avatar.png';
  }

  let result;
  if (props.src.startsWith('http')) {
    result = props.src;
  } else {
    result = `${API_BASE_URL}${props.src}`;
  }
  
  return result;
});

const sizeClasses = computed(() => {
  const sizes = {
    'xs': 'w-8 h-8',
    'sm': 'w-12 h-12',
    'md': 'w-16 h-16',
    'lg': 'w-24 h-24',
    'xl': 'w-32 h-32',
  };
  return sizes[props.size] || sizes.md;
});

const handleError = () => {
  hasError.value = true;
};
</script>

<template>
  <div :class="['rounded-full overflow-hidden', sizeClasses]">
    <img
      :src="avatarUrl"
      :alt="alt"
      @error="handleError"
      class="w-full h-full object-cover"
    />
  </div>
</template>