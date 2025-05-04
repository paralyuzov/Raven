<script setup>
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers, maxLength } from '@vuelidate/validators';
import InputField from "../ui/InputField.vue";
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import { getErrorMessage, touchField, handleServerErrors } from '../../utils/validationUtils';

const authStore = useAuthStore();
const form = reactive({
  firstName: '',
  lastName: '',
  nickname: '',
  email: '',
  password: '',
  repassword: ''
});

const serverErrors = ref({});
const router = useRouter();

const rules = {
  firstName: {
    required: helpers.withMessage('First name is required', required),
    minLength: helpers.withMessage('First name must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('First name must be at most 20 characters', maxLength(20))
  },
  lastName: {
    required: helpers.withMessage('Last name is required', required),
    minLength: helpers.withMessage('Last name must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Last name must be at most 20 characters', maxLength(20))
  },
  nickname: {
    required: helpers.withMessage('Nickname is required', required),
    minLength: helpers.withMessage('Nickname must be at least 3 characters', minLength(3)),
    maxLength: helpers.withMessage('Nickname must be at most 20 characters', maxLength(20))
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Please enter a valid email address', email)
  },
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Password must be at least 8 characters', minLength(8))
  },
  repassword: {
    required: helpers.withMessage('Please confirm your password', required),
    sameAs: helpers.withMessage('Passwords must match', sameAs(computed(() => form.password)))
  }
};

const v$ = useVuelidate(rules, form);

const getFieldError = (field) => getErrorMessage(v$.value, serverErrors.value, field);
const touchFormField = (field) => touchField(v$.value, serverErrors.value, field);

const handleSubmit = async () => {
  serverErrors.value = {}; 
  
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  try {
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      nickname: form.nickname,
      email: form.email,
      password: form.password
    }
    await authStore.registerUser(userData);
    router.push('/login');
  } catch (error) {
    console.log(error);
    handleServerErrors(error, serverErrors.value);
  }
};
</script>

<template>
  <div class="min-w-2xl mx-auto p-8 rounded-2xl">
    <h2 class="text-2xl font-orbitron text-center text-purple-700 mb-6">Create Account</h2>

    <div v-if="serverErrors.general" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ serverErrors.general }}
    </div>

    <form @submit.prevent="handleSubmit">
      <InputField id="firstName" label="First Name" v-model="form.firstName" :error="getFieldError('firstName')"
        placeholder="Enter your first name" @blur="touchFormField('firstName')" />

      <InputField id="lastName" label="Last Name" v-model="form.lastName" :error="getFieldError('lastName')"
        placeholder="Enter your last name" @blur="touchFormField('lastName')" />

      <InputField id="nickname" label="Nickname" v-model="form.nickname" :error="getFieldError('nickname')"
        placeholder="Enter your nickname" @blur="touchFormField('nickname')" />

      <InputField id="email" label="Email" type="email" v-model="form.email" :error="getFieldError('email')"
        placeholder="Enter your email" @blur="touchFormField('email')" />

      <InputField id="password" label="Password" type="password" v-model="form.password"
        :error="getFieldError('password')" placeholder="Enter your password" @blur="touchFormField('password')" />

      <InputField id="repassword" label="Confirm Password" type="password" v-model="form.repassword"
        :error="getFieldError('repassword')" placeholder="Confirm your password" @blur="touchFormField('repassword')" />

      <button type="submit"
        class="w-full py-2 mt-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300"
        :disabled="v$.value?.$invalid">
        Sign Up
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