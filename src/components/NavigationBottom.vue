<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faContactBook } from '@fortawesome/free-solid-svg-icons/faContactBook';
import { faUser } from '@fortawesome/free-solid-svg-icons';

</script>

<template>
    <nav class="fixed bottom-0 left-0 w-full bg-slate-800 shadow-lg">
      <div class="flex justify-around py-3">
        <div class="text-white flex space-x-12 items-center ">
            <p class="bg-slate-600 p-3 rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500"><FontAwesomeIcon :icon="faHouse" class="text-2xl" /></p>
            <p class="bg-slate-600 p-3 rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500"><FontAwesomeIcon :icon="faContactBook" class="text-2xl" /></p>
            <p class="bg-slate-600 p-3 rounded-full hover:bg-violet-900 cursor-pointer hover:rotate-6 transition-all ease-in-out duration-500"><FontAwesomeIcon :icon="faUser" class="text-2xl" /></p>

        </div>
      </div>
    </nav>
  </template>