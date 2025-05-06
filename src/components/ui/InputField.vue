<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String,
  theme: {
    type: String,
    default: 'light'
  },
  icon: String
});

defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="mb-4">
    <label 
      :for="id" 
      :class="[
        'block mb-2 text-sm font-medium', 
        theme === 'dark' ? 'text-white' : 'text-gray-700'
      ]"
    >
      {{ label }}
    </label>
    
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i :class="`fas fa-${icon} text-gray-400`"></i>
      </div>
      
      <input 
        :type="type" 
        :id="id" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')" 
        :placeholder="placeholder"
        :class="[
          'w-full rounded-lg focus:outline-none transition duration-300',
          icon ? 'pl-4' : 'pl-4',
          theme === 'dark' 
            ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50' 
            : 'border border-gray-200 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600',
          error ? (theme === 'dark' ? 'border-red-500/50 focus:border-red-500' : 'border-red-500')  : ''
        ]"
        class="py-3 px-2"
      />
    </div>
    
    <p v-if="error" class="mt-2 text-sm" :class="theme === 'dark' ? 'text-red-400' : 'text-red-600'">{{ error }}</p>
  </div>
</template>
