<template>
  <div>
    <Navbar />
    <div class="container mx-auto flex justify-center items-center pt-40">
      <div class="imagen-degradada">
        <img src="/wallpaper.jpg" alt="Imagen" class="w-10/10 h-screen/3 object-cover object-center">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from "@/components/Navbar.vue";

</script>
