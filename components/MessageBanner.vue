<template>
  <div :class="bannerClass" class="flex items-center p-4 rounded-lg mb-4 shadow-md relative overflow-hidden">
    <!-- Barra de progreso (solo si no es persistente) -->
    <div v-if="!persistent" class="absolute top-0 left-0 h-1 bg-current opacity-30 transition-all duration-100 ease-linear" 
         :style="{ width: `${progressWidth}%` }"></div>
    
    <button @click="closeBanner" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Cerrar">
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
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: 'success' }, // success, error, warning
  persistent: { type: Boolean, default: false } // Si es true, el banner no se cierra automáticamente
});

const emit = defineEmits(['close']);

const progressWidth = ref(100);
const timer = ref(null);
const progressTimer = ref(null);

const bannerClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-50 border border-green-200 text-green-800';
    case 'error': return 'bg-red-50 border border-red-200 text-red-800';
    case 'warning': return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
    default: return 'bg-gray-50 border text-gray-800';
  }
});

const closeBanner = () => {
  clearTimeout(timer.value);
  clearInterval(progressTimer.value);
  emit('close');
};

onMounted(() => {
  // Solo iniciar temporizador y barra de progreso si NO es persistente
  if (!props.persistent) {
    // Iniciar el temporizador de 5 segundos
    timer.value = setTimeout(() => {
      emit('close');
    }, 5000);

    // Iniciar la barra de progreso
    const startTime = Date.now();
    const duration = 5000; // 5 segundos

    progressTimer.value = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      progressWidth.value = remaining;

      if (remaining <= 0) {
        clearInterval(progressTimer.value);
      }
    }, 50); // Actualizar cada 50ms para una animación suave
  }
});

onUnmounted(() => {
  clearTimeout(timer.value);
  clearInterval(progressTimer.value);
});
</script> 