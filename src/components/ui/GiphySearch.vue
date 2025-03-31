<script setup>
import { ref, onMounted, watch } from "vue";
import { GiphyFetch } from "@giphy/js-fetch-api";

const emit = defineEmits(["select-gif"]);
const gifs = ref([]);
const query = ref(""); 
const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

const fetchGifs = async () => {
  const { data } = await gf.trending({ limit: 10 });
  gifs.value = data;
};

const searchGifs = async () => {
  if (query.value.trim() === "") {
    return fetchGifs(); 
  }
  const { data } = await gf.search(query.value, { limit: 10 });
  gifs.value = data;
};

onMounted(fetchGifs);
</script>

<template>
  <div class="bg-white p-3 rounded-lg shadow-lg max-w-xs">
    <input 
      v-model="query" 
      @input="searchGifs" 
      type="text" 
      placeholder="Search GIFs..." 
      class="w-full p-2 mb-2 border rounded-md"
    />
    <div class="grid grid-cols-3 gap-2">
      <img 
        v-for="gif in gifs" 
        :key="gif.id" 
        :src="gif.images.fixed_height.url" 
        class="cursor-pointer rounded-md hover:scale-105 transition"
        @click="emit('select-gif', gif.images.fixed_height.url)" 
      />
    </div>
  </div>
</template>