

<script>
import { reactive } from 'vue';
import InputField from "../ui/InputField.vue";
import { useAuthStore } from '../../stores/authStore';

export default {
  components: {
    InputField,
  },
  setup() {
    const authStore = useAuthStore();
    const form = reactive({
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      password: '',
      repassword: ''
    });

    const errors = reactive({});

    const handleSubmit = async () => {
       try {
          const userData = {
            firstName:form.firstName,
            lastName:form.lastName,
            nickname:form.nickname,
            email:form.email,
            password:form.password
          }
          await authStore.registerUser(userData);
       } catch (error) {
          console.log(error);
       }
    };

    return {
      form,
      errors,
      handleSubmit,
    };
  },
};
</script>

<template>
  <div class="min-w-2xl mx-auto  p-8 rounded-2xl ">
    <h2 class="text-2xl font-orbitron text-center text-purple-700 mb-6">Create Account</h2>
    <form @submit.prevent="handleSubmit">
      <InputField
        id="firstName"
        label="First Name"
        v-model="form.firstName"
        :error="errors.firstName"
        placeholder="Enter your first name"
      />
      <InputField
        id="lastName"
        label="Last Name"
        v-model="form.lastName"
        :error="errors.lastName"
        placeholder="Enter your last name"
      />


      <InputField
        id="nickname"
        label="Nickname"
        v-model="form.nickname"
        :error="errors.nickname"
        placeholder="Enter your nickname"
      />


      <InputField
        id="email"
        label="Email"
        type="email"
        v-model="form.email"
        :error="errors.email"
        placeholder="Enter your email"
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        v-model="form.password"
        :error="errors.password"
        placeholder="Enter your password"
      />

      <InputField
        id="repassword"
        label="Confirm Password"
        type="password"
        v-model="form.repassword"
        :error="errors.repassword"
        placeholder="Confirm your password"
      />

      <button type="submit" class="w-full py-2 mt-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300">
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