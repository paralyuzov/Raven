<script setup>
import NavigationBottom from './components/NavigationBottom.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen bg-slate-700">
      <div class="">
        <router-view />
      </div>
      <NavigationBottom />
    </div>
  </template>
