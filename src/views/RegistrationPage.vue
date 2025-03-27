<script>
import Registration from '../components/forms/Registration.vue';

export default {
    components: {
        Registration,
    },
};
</script>


<template>
    <div class="flex-grow flex items-center justify-center  px-4 min-h-screen ">


        <div
            class="flex space-x-5 bg-gradient-to-tr from-gray-300  via-fuchsia-50  to-gray-200 text-purple-700 font-orbitron rounded-4xl">

            <div class="p-10 flex flex-col space-y-7 ">
                <div>
                    <img src="../assets/logo.png" alt=""
                        class=" w-80 aspect-auto rounded-full saturate-200 hover:-rotate-3 ease-in-out duration-1000 -skew-5">
                </div>
                <h2 class="text-5xl tracking-wide ">Welcome to RAVEN</h2>
                <p class="text-xl font-orbitron text-purple-500 ">Your private message platform</p>
                <p class="text-sm font-mono text-black ">Already have an account? Login here.</p>
            </div>


            <Registration />
        </div>
    </div>
</template>
