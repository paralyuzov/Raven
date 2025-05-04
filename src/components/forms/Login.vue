<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import InputField from '../ui/InputField.vue';
import { useVuelidate } from '@vuelidate/core'
import { getErrorMessage, touchField,handleServerErrors } from '../../utils/validationUtils';

import { email, helpers, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const form = reactive({
  email: "",
  password: ""
})

const serverErrors = ref({});

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Please enter a valid email address', email),
  }
}

const v$ = useVuelidate(rules, form);
const router = useRouter();


const getFieldError = (field) => getErrorMessage(v$.value, serverErrors.value, field);
const touchFormField = (field) => touchField(v$.value, serverErrors.value, field);

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (!isFormCorrect) {
    return;
  }
  try {
    const credentials = {
      email: form.email,
      password: form.password,
    }
    await authStore.loginUser(credentials);
    router.push({name:"messages"});
  } catch (error) {
    console.log(error);
    handleServerErrors(error, serverErrors.value);
  }
}


</script>

<template>
  <div class="min-w-xl mx-auto  p-8 rounded-2xl ">
    <h2 class="text-2xl font-orbitron text-center text-purple-700 mb-4">Login to your account</h2>
    <div v-if="serverErrors.general" class="mb-4 p-3 font-exo bg-red-100 border border-red-400 text-red-700 rounded">
      {{ serverErrors.general }}
    </div>
    <form @submit.prevent="handleSubmit">

      <InputField id="email" label="Email" type="email" v-model="form.email" :error="getFieldError('email')"
      placeholder="Enter your email" @blur="touchFormField('email')" />

      <InputField id="password" label="Password" type="password" v-model="form.password"
      :error="getFieldError('password')" placeholder="Enter your password" @blur="touchFormField('password')" />


      <button type="submit"
        class="w-full py-2 mt-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300">
        Login
      </button>
    </form>
  </div>
</template>

<style scoped>
input {
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}
</style>