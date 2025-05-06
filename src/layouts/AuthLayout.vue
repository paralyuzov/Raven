<script setup>
import NavigationBottom from '../components/NavigationBottom.vue';
</script>

<template>
    <div class="flex flex-col min-h-screen bg-slate-900">
      <div class="flex-1">
        <router-view />
      </div>
      <NavigationBottom />
    </div>
  </template>
  
