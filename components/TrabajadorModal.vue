<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isViewing ? 'Detalles de Trabajador' : (isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador') }}
        </h2>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="formData.nombre" type="text" required :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el nombre del trabajador" />
          </div>
          <!-- Cargo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <input v-model="formData.cargo" type="text" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el cargo" />
          </div>
          <!-- Carnet de Identidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad</label>
            <input v-model="formData.carnet_identidad" type="text" required :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el carnet de identidad"
              maxlength="11"
              @input="onCarnetInput"
            />
          </div>
          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="formData.num_telefono" type="text" :readonly="isViewing" :disabled="isViewing"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el número de teléfono"
              @input="onTelefonoInput" />
          </div>
        </div>
        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!isViewing">
          <button type="button" @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancelar
          </button>
          <button type="submit"
            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Trabajador' }}
          </button>
        </div>
      </form>
      
      <!-- Tabla de Contratos -->
      <div v-if="isViewing || isEditing" class="mt-8">
        <h3 class="text-lg font-semibold mb-2">Contratos Asociados</h3>
        <DataTable
          :columns="contratosColumns"
          :items="contratosData"
          :total-items="contratosTotal"
          :items-per-page="contratosPerPage"
          :current-page="contratosPage"
          :is-loading="false"
          :show-actions="false"
          @page-change="handleContratosPageChange"
        />
      </div>
      
      <div v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import DataTable from './DataTable.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  trabajador: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false },
  isViewing: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'submit']);
const formData = ref({
  nombre: '',
  cargo: '',
  carnet_identidad: '',
  num_telefono: ''
});
const errorMsg = ref('');

watch(() => props.trabajador, (trabajador) => {
  if (trabajador && Object.keys(trabajador).length > 0) {
    formData.value = {
      nombre: trabajador.nombre || '',
      cargo: trabajador.cargo || '',
      carnet_identidad: trabajador.carnet_identidad || '',
      num_telefono: trabajador.num_telefono || ''
    };
  } else {
    formData.value = {
      nombre: '',
      cargo: '',
      carnet_identidad: '',
      num_telefono: ''
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  errorMsg.value = '';
  if (!formData.value.nombre || !formData.value.carnet_identidad) {
    errorMsg.value = 'Todos los campos son obligatorios.';
    return;
  }
  emit('submit', { ...formData.value });
};

const onCarnetInput = (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  formData.value.carnet_identidad = value;
};

const onTelefonoInput = (e) => {
  let value = e.target.value;
  // Permitir solo números del 0-9 y los símbolos + y -
  value = value.replace(/[^0-9+\-]/g, '');
  formData.value.num_telefono = value;
};

// Columnas para la tabla de contratos
const contratosColumns = [
  { key: 'id_contrato', label: 'ID Contrato' },
  { key: 'fecha_inicio', label: 'Fecha de Inicio' },
  { key: 'fecha_fin', label: 'Fecha de Fin' },
  { key: 'entidad_nombre', label: 'Entidad' },
  { key: 'tipo_contrato_nombre', label: 'Tipo de Contrato' }
];

// Computed para los contratos del trabajador
const contratosData = computed(() => {
  if (!props.trabajador || !Array.isArray(props.trabajador.contratos)) return [];
  return props.trabajador.contratos.map(c => ({
    id_contrato: c.id_contrato,
    fecha_inicio: c.fecha_inicio ? c.fecha_inicio.split('T')[0] : '',
    fecha_fin: c.fecha_fin ? c.fecha_fin.split('T')[0] : '',
    entidad_nombre: c.entidad?.nombre || '',
    tipo_contrato_nombre: c.tipoContrato?.nombre || ''
  }));
});

const contratosTotal = computed(() => contratosData.value.length);
const contratosPage = ref(1);
const contratosPerPage = 5;

const handleContratosPageChange = (newPage) => {
  contratosPage.value = newPage;
};
</script> 