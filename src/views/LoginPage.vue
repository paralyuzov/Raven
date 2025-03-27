<script>
import Login from '../components/forms/Login.vue';
export default {
    components: {
        Login
    },

}
</script>

<template>
    <div class="flex-grow flex items-center justify-center px-4 min-h-screen">

   
    <div
        class="flex  space-x-5 bg-gradient-to-tr from-gray-300  via-fuchsia-50  to-gray-200 text-purple-700 font-orbitron rounded-4xl">

        <div class="p-10 flex justify-center items-center flex-col space-y-4 ">
            <img src="../assets/logo.png" alt=""
                class=" w-80 aspect-auto rounded-full saturate-200 hover:-rotate-3 ease-in-out duration-1000 -skew-5">
            <Login />
            <p class="text-sm font-mono text-black ">Don't have an account? Register here.</p>
        </div>

    </div>
</div>

</template>