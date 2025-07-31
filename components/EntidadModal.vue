<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ props.isViewing ? 'Detalles de Entidad' : (isEditing ? 'Editar Entidad' : 'Nueva Entidad') }}
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
            <input
              v-model="formData.nombre"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              placeholder="Ingrese el nombre"
            />
          </div>

          <!-- Dirección -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              v-model="formData.direccion"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              placeholder="Ingrese la dirección"
            />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="formData.telefono"
              type="tel"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              @input="onTelefonoInput"
              placeholder="Ej: +50312345678"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <!-- Cuenta Bancaria -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cuenta Bancaria</label>
            <input
              v-model="formData.cuenta_bancaria"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              maxlength="19"
              @input="onCuentaBancariaInput"
              placeholder="0000-0000-0000-0000"
            />
          </div>

          <!-- Tipo de Entidad -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Entidad</label>
            <input
              v-model="formData.tipo_entidad"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el tipo de entidad"
              required
              :readonly="props.isViewing"
              :disabled="props.isViewing"
            />
          </div>

          <!-- Código REEUP -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código REEUP</label>
            <input
              v-model="formData.codigo_reeup"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              placeholder="Ingrese el código REEUP"
            />
          </div>

          <!-- Código NIT -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código NIT</label>
            <input
              v-model="formData.codigo_nit"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :readonly="props.isViewing"
              :disabled="props.isViewing"
              placeholder="Ingrese el código NIT"
            />
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-4 mt-6" v-if="!props.isViewing">
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
            {{ isEditing ? 'Guardar Cambios' : 'Crear Entidad' }}
          </button>
        </div>
      </form>
      <div v-if="props.isViewing || isEditing" class="mt-8">
        <h3 class="text-lg font-semibold mb-2">Datos De Contratos</h3>
        <DataTable
          :columns="contratosColumns"
          :items="contratosData"
          :total-items="contratosTotal"
          :items-per-page="contratosPerPage"
          :current-page="contratosPage"
          :is-loading="false"
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
  modelValue: {
    type: Boolean,
    required: true
  },
  entidad: {
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
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  cuenta_bancaria: '',
  tipo_entidad: '',
  codigo_reeup: '',
  codigo_nit: ''
});

const errorMsg = ref('');

// Observar cambios en la entidad para cargar datos cuando se abre el modal
watch(() => props.entidad, (newEntidad) => {
  if (newEntidad && Object.keys(newEntidad).length > 0) {
    formData.value = { ...newEntidad };
  } else {
    // Resetear el formulario si no hay entidad
    formData.value = {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      cuenta_bancaria: '',
      tipo_entidad: '',
      codigo_reeup: '',
      codigo_nit: ''
    };
  }
}, { immediate: true });

function onTelefonoInput(e) {
  let value = e.target.value;
  // Permitir solo 0-9, + y - en cualquier posición
  value = value.replace(/[^0-9+-]/g, '');
  // Solo un + al inicio
  if (value.startsWith('+')) {
    value = '+' + value.slice(1).replace(/\+/g, '');
  } else {
    value = value.replace(/\+/g, '');
  }
  // Ya no hay límite de caracteres
  formData.value.telefono = value;
}

function onCuentaBancariaInput(e) {
  let value = e.target.value;
  // Eliminar todo lo que no sea número
  value = value.replace(/[^0-9]/g, '');
  // Formatear a 0000-0000-0000-0000 (19 caracteres incluyendo guiones)
  let formatted = '';
  for (let i = 0; i < value.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0 && formatted.split('-').length <= 3) {
      formatted += '-';
    }
    formatted += value[i];
  }
  formData.value.cuenta_bancaria = formatted;
}

const handleSubmit = () => {
  errorMsg.value = '';
  
  // Validación de campos obligatorios
  if (!formData.value.nombre || formData.value.nombre.trim() === '') {
    errorMsg.value = 'El nombre es obligatorio.';
    return;
  }
  
  if (!formData.value.direccion || formData.value.direccion.trim() === '') {
    errorMsg.value = 'La dirección es obligatoria.';
    return;
  }
  
  if (!formData.value.telefono || formData.value.telefono.trim() === '') {
    errorMsg.value = 'El teléfono es obligatorio.';
    return;
  }
  
  if (!formData.value.tipo_entidad || formData.value.tipo_entidad.trim() === '') {
    errorMsg.value = 'El tipo de entidad es obligatorio.';
    return;
  }
  
  // Validación Teléfono: solo un + al inicio, el resto números o guiones, sin límite de caracteres
  if (!/^\+?[0-9-]+$/.test(formData.value.telefono)) {
    errorMsg.value = 'El teléfono solo puede contener un símbolo + al inicio, números y guiones.';
    return;
  }
  
  // Validación Cuenta Bancaria: formato 0000-0000-0000-0000 (solo si se proporciona)
  if (formData.value.cuenta_bancaria && formData.value.cuenta_bancaria.trim() !== '' && !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.value.cuenta_bancaria)) {
    errorMsg.value = 'La cuenta bancaria debe tener el formato 0000-0000-0000-0000 (16 dígitos y 3 guiones).';
    return;
  }
  
  emit('submit', formData.value);
};

// Columnas para la tabla de contratos
const contratosColumns = [
  { key: 'num_consecutivo', label: 'N° Consecutivo' },
  { key: 'fecha_inicio', label: 'Fecha de Inicio' },
  { key: 'fecha_fin', label: 'Fecha de Fin' },
  { key: 'tipo_contrato', label: 'Tipo de Contrato' },
  { key: 'num_trabajadores', label: 'Trabajadores Autorizados' }
];

// Computed para los contratos de la entidad
const contratosData = computed(() => {
  if (!props.entidad || !Array.isArray(props.entidad.contratos)) return [];
  return props.entidad.contratos.map(c => ({
    num_consecutivo: c.num_consecutivo,
    fecha_inicio: c.fecha_inicio ? c.fecha_inicio.split('T')[0] : '',
    fecha_fin: c.fecha_fin ? c.fecha_fin.split('T')[0] : '',
    tipo_contrato: c.tipoContrato?.nombre || '',
    num_trabajadores: Array.isArray(c.trabajadoresAutorizados) ? c.trabajadoresAutorizados.length : 0
  }));
});

const contratosTotal = computed(() => contratosData.value.length);
const contratosPage = ref(1);
const contratosPerPage = 5;

const handleContratosPageChange = (newPage) => {
  contratosPage.value = newPage;
};
</script> 