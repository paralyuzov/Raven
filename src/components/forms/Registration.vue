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
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold font-orbitron text-white mb-8 text-center">
      Create Your Account
    </h2>

    <div v-if="serverErrors.general" class="mb-6 p-4 bg-red-500/20 border border-red-500/30 backdrop-blur-sm text-white rounded-lg">
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ serverErrors.general }}</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField 
          id="firstName" 
          label="First Name" 
          v-model="form.firstName" 
          :error="getFieldError('firstName')"
          placeholder="Enter your first name" 
          @blur="touchFormField('firstName')"
          theme="dark" 
        />

        <InputField 
          id="lastName" 
          label="Last Name" 
          v-model="form.lastName" 
          :error="getFieldError('lastName')"
          placeholder="Enter your last name" 
          @blur="touchFormField('lastName')"
          theme="dark" 
        />
      </div>

      <InputField 
        id="nickname" 
        label="Nickname" 
        v-model="form.nickname" 
        :error="getFieldError('nickname')"
        placeholder="Choose a nickname" 
        @blur="touchFormField('nickname')"
        theme="dark"
        icon="user" 
      />

      <InputField 
        id="email" 
        label="Email Address" 
        type="email" 
        v-model="form.email" 
        :error="getFieldError('email')"
        placeholder="your.email@example.com" 
        @blur="touchFormField('email')"
        theme="dark"
        icon="envelope" 
      />

      <InputField 
        id="password" 
        label="Password" 
        type="password" 
        v-model="form.password"
        :error="getFieldError('password')" 
        placeholder="Create a strong password" 
        @blur="touchFormField('password')"
        theme="dark"
        icon="lock" 
      />

      <InputField 
        id="repassword" 
        label="Confirm Password" 
        type="password" 
        v-model="form.repassword"
        :error="getFieldError('repassword')" 
        placeholder="Confirm your password" 
        @blur="touchFormField('repassword')"
        theme="dark"
        icon="lock" 
      />

      <div class="pt-2">
        <button 
          type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-lg 
                 hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                 transform transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="v$.value?.$invalid || authStore.loading"
        >
          <div class="flex items-center justify-center">
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ authStore.loading ? 'Creating account...' : 'Sign Up' }}</span>
          </div>
        </button>
      </div>
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