<template>
  <div :class="bannerClass" class="flex items-center p-4 rounded-lg mb-4 shadow-md relative">
    <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Cerrar">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <span class="mr-3">
      <component :is="iconComponent" class="h-6 w-6" />
    </span>
    <div class="flex-1">
      <div class="font-bold text-base mb-1">{{ title }}</div>
      <div class="text-sm mb-2">{{ description }}</div>
      <div class="flex gap-2 mt-2">
        <button @click="$emit('confirm')" class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Sí</button>
        <button @click="$emit('close')" class="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: [Object, Function, String], required: true }, // Componente, función o string para el icono
  type: { type: String, default: 'info' } // Para estilos opcionales
});

const bannerClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-50 border border-green-200';
    case 'error': return 'bg-red-50 border border-red-200';
    case 'warning': return 'bg-yellow-50 border border-yellow-200';
    default: return 'bg-gray-50 border';
  }
});

const iconComponent = computed(() => props.icon);
</script> 