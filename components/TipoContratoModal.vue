<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
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
              :disabled="isViewing"
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
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Crear Tipo de Contrato' }}
          </button>
        </div>
      </form>
      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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

watch(() => props.tipoContrato, (newTipoContrato) => {
  if (newTipoContrato && Object.keys(newTipoContrato).length > 0) {
    formData.value = { nombre: newTipoContrato.nombre || '' };
  } else {
    formData.value = {
      nombre: ''
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  errorMsg.value = '';
  if (!formData.value.nombre) {
    errorMsg.value = 'El nombre es obligatorio.';
    return;
  }
  emit('submit', formData.value);
};
</script> 