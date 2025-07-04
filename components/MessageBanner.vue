<template>
  <div :class="bannerClass" class="flex items-center p-4 rounded-lg mb-4 shadow-md relative">
    <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Cerrar">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <span class="mr-3">
      <template v-if="type === 'success'">
        <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      </template>
      <template v-else-if="type === 'error'">
        <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </template>
      <template v-else-if="type === 'warning'">
        <svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </template>
    </span>
    <div>
      <div class="font-bold text-base mb-1">{{ title }}</div>
      <div class="text-sm">{{ description }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: 'success' } // success, error, warning
});

const bannerClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-50 border border-green-200';
    case 'error': return 'bg-red-50 border border-red-200';
    case 'warning': return 'bg-yellow-50 border border-yellow-200';
    default: return 'bg-gray-50 border';
  }
});
</script> 