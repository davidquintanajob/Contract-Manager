<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <!-- MessageBanner para mostrar estado de carga -->
    <div v-if="loadingBanner" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
      <MessageBanner 
        :title="loadingBanner.title" 
        :description="loadingBanner.description" 
        :type="loadingBanner.type"
        @close="loadingBanner = null" 
        class="pointer-events-auto" 
      />
    </div>
    
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isViewing ? 'Detalles de Tipo de Contrato' : (isEditing ? 'Editar Tipo de Contrato' : 'Nuevo Tipo de Contrato') }}
        </h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="formData.nombre"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              :readonly="isViewing"
              :disabled="isViewing || isLoading"
              placeholder="Ingrese el nombre del tipo de contrato"
            />
          </div>
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!isViewing">
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? 'Guardando...' : 'Creando...' }}
            </span>
            <span v-else>
              {{ isEditing ? 'Guardar Cambios' : 'Crear Tipo de Contrato' }}
            </span>
          </button>
        </div>
      </form>
      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import MessageBanner from './MessageBanner.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  tipoContrato: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  isViewing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const formData = ref({
  nombre: ''
});

const errorMsg = ref('');
const isLoading = ref(false);
const loadingBanner = ref(null);

watch(() => props.tipoContrato, (newTipoContrato) => {
  if (newTipoContrato && Object.keys(newTipoContrato).length > 0) {
    formData.value = { nombre: newTipoContrato.nombre || '' };
  } else {
    formData.value = {
      nombre: ''
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  errorMsg.value = '';
  if (!formData.value.nombre) {
    errorMsg.value = 'El nombre es obligatorio.';
    return;
  }
  
  // Activar estado de carga
  isLoading.value = true;
  loadingBanner.value = {
    title: props.isEditing ? 'Guardando Tipo de Contrato' : 'Creando Tipo de Contrato',
    description: 'Comunicando con el servidor, espere por favor...',
    type: 'warning'
  };
  
  try {
    // Emitir el evento submit y esperar la respuesta
    await new Promise((resolve, reject) => {
      emit('submit', formData.value);
      // Simular un pequeño delay para que el usuario vea el mensaje
      setTimeout(resolve, 100);
    });
  } catch (error) {
    console.error('Error en handleSubmit:', error);
  } finally {
    // Desactivar estado de carga después de un breve delay
    setTimeout(() => {
      isLoading.value = false;
      loadingBanner.value = null;
    }, 500);
  }
};
</script> 