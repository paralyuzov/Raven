<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import InputField from '../ui/InputField.vue';
import { useVuelidate } from '@vuelidate/core'
import { getErrorMessage, touchField, handleServerErrors } from '../../utils/validationUtils';
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
  },
  password: {
    required: helpers.withMessage('Password is required', required),
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
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold font-orbitron text-purple-400 mb-8 text-center">
      Sign In
    </h2>

    <div v-if="serverErrors.general" class="mb-6 p-4 bg-red-900/40 border border-red-800/50 text-red-300 rounded-lg">
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ serverErrors.general }}</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <InputField 
        id="email" 
        label="Email Address" 
        type="email" 
        v-model="form.email" 
        :error="getFieldError('email')"
        placeholder="Enter your email" 
        @blur="touchFormField('email')"
        icon="envelope" 
        theme="dark"
      />

      <InputField 
        id="password" 
        label="Password" 
        type="password" 
        v-model="form.password"
        :error="getFieldError('password')" 
        placeholder="Enter your password" 
        @blur="touchFormField('password')"
        icon="lock" 
        theme="dark"

      />

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center">
          <input id="remember" type="checkbox" class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-slate-800">
          <label for="remember" class="ml-2 block text-slate-300">
            Remember me
          </label>
        </div>

        <div class="text-right">
          <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors">
            Forgot password?
          </a>
        </div>
      </div>

      <div class="pt-2">
        <button 
          type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white font-semibold rounded-lg 
                 hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-1 focus:ring-offset-slate-800
                 transition-all duration-300 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="v$.value?.$invalid || authStore.loading"
        >
          <div class="flex items-center justify-center">
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ authStore.loading ? 'Signing in...' : 'Sign In' }}</span>
          </div>
        </button>
      </div>
    </form>

    
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  color-scheme: dark;
}
</style>