<script>
import { reactive } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import InputField from '../ui/InputField.vue';
export default {
    components: {
        InputField,
    },
    setup() {
        const authStore = useAuthStore();
        const form = reactive({
            email:"",
            password:""
        })
        const errors = reactive({});

        const handleSubmit = async () => {
            try {
                const credentials = {
                    email:form.email,
                    password:form.password,
                }
               await authStore.loginUser(credentials);
            } catch (error) {
                console.log(error);
            }
        }

        return {
            handleSubmit,
            form,
            errors
        }
    }

}


</script>

<template>
    <div class="min-w-xl mx-auto  p-8 rounded-2xl ">
      <h2 class="text-2xl font-orbitron text-center text-purple-700 mb-4">Login to your account</h2>
      <form @submit.prevent="handleSubmit">
    
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
  
  
        <button type="submit" class="w-full py-2 mt-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-300">
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