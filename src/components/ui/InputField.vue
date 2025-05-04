<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    id: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateValue = (value) => {
      emit('update:modelValue', value);
    };

    return {
      updateValue,
    };
  },
};
</script>

<template>
  <div class="mb-2 drop-shadow-2xl">
    <label :for="id" class="block font-mono font-bold   text-gray-900">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="updateValue($event.target.value)" 
      :placeholder="placeholder"
      :class="[
        'tracking-wide mt-2 block w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 shadow-md transition-all duration-300 ease-in-out',
        error ? 'border-red-500 focus:ring-red-500' : ''
      ]"
    />
    <p v-if="error" class="mt-1 text-sm font-exo text-red-500">{{ error }}</p>
  </div>
</template>
